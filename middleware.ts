import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  // Skip auth if Supabase isn't configured
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — IMPORTANT: don't remove this
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some(p => path === p) || path.startsWith('/api/') || path.startsWith('/auth/');

  // Redirect unauthenticated users from protected routes
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/signup
  if (user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
