import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, role, stage } = body;

    // AI Prompt Engineering for the Premium Interviewer
    const systemPrompt = `
      You are an elite, senior-level technical interviewer and psychologist at a top-tier tech company.
      You are conducting a ${role} interview.
      The candidate's response to the previous question was: "${transcript}"

      Analyze their response for:
      1. Technical accuracy and depth.
      2. Communication clarity (did they use filler words or sound uncertain?).
      3. Emotional stability and confidence.

      Output your response as JSON:
      {
        "feedback": "Strict but constructive feedback on what they just said",
        "nextQuestion": "The next logical interview question, adapting to their skill level",
        "metrics": {
          "confidenceScore": 85,
          "techScore": 90,
          "fillerWordsDetected": 2
        }
      }
    `;

    // Simulated AI response strategy (since we don't have their API keys injected yet)
    // Normally, here you would call OpenAI: openai.chat.completions.create(...)
    
    // Simulating deep personality and tech processing
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
