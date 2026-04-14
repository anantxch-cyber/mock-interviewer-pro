import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, role, stage } = body;

    // Input validation
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid transcript' }, { status: 400 });
    }
    if (!role || typeof role !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid role' }, { status: 400 });
    }

    // Sanitize inputs — truncate to prevent abuse, strip control characters
    const sanitizedTranscript = transcript.slice(0, 5000).replace(/[\x00-\x1f]/g, '');
    const sanitizedRole = role.slice(0, 100).replace(/[\x00-\x1f]/g, '');

    // AI Prompt Engineering for the Premium Interviewer
    // NOTE: In production, use parameterized message arrays (system + user messages)
    // instead of string interpolation to prevent prompt injection attacks.
    // Example with OpenAI:
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: sanitizedTranscript }
    //   ]
    const systemPrompt = `You are an elite, senior-level technical interviewer and psychologist at a top-tier tech company. You are conducting a ${sanitizedRole} interview. Analyze the candidate's response for: 1. Technical accuracy and depth. 2. Communication clarity (filler words or uncertainty). 3. Emotional stability and confidence. Output your response as JSON with keys: feedback, nextQuestion, metrics (confidenceScore, techScore, fillerWordsDetected).`;

    // Simulated AI response (replace with actual API call in production)
    // In production: const response = await openai.chat.completions.create({...})
    const simulatedResponse = {
      feedback: "Your explanation of the monolith migration was clear, but you lacked specific metrics. Always back up scaling decisions with data.",
      nextQuestion: "If you had to design a distributed cache system to solve that bottleneck, how would you handle cache invalidation across multiple regions?",
      metrics: {
        confidenceScore: 78,
        techScore: 82,
        fillerWordsDetected: 3
      }
    };

    return NextResponse.json(simulatedResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process interview data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'InterviewAI Pro API is running',
    version: '1.0.0',
  });
}
