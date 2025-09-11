import OpenAI from 'openai';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Journal from '@/models/Journal';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export async function GET() {
  try {
    await connectDB();
    
    const entries = await Journal.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { text } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Journal text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Journal entry must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Journal entry must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add your OpenAI API key.' },
        { status: 500 }
      );
    }

    // Step 1: Content moderation check
    let moderationResult;
    try {
      moderationResult = await openai.moderations.create({
        input: text,
      });
    } catch (error) {
      console.error('Moderation API error:', error);
      return NextResponse.json(
        { error: 'Content moderation service unavailable, please try again later.' },
        { status: 503 }
      );
    }

  // Be defensive: moderationResult.results may be undefined, so use optional chaining
  const flagged = moderationResult?.results?.[0]?.flagged;
  const categories = moderationResult?.results?.[0]?.categories;

    // Check for self-harm or urgent content
    if (flagged && (categories?.['self-harm'] || categories?.['self-harm/intent'] || categories?.['self-harm/instructions'])) {
      // Save urgent entry to database
      try {
        await connectDB();
        const urgentEntry = new Journal({
          text,
          mood: 'Crisis',
          reflection: 'Crisis content detected',
          suggestions: ['Contact emergency services', 'Call crisis helpline', 'Reach out to trusted person'],
          severity: 'urgent'
        });
        await urgentEntry.save();
      } catch (dbError) {
        console.error('Failed to save urgent entry:', dbError);
      }

      return NextResponse.json({
        severity: "urgent",
        message: "We detected crisis-related content. Please reach out to a local helpline immediately. In the US, call 988 for the Suicide & Crisis Lifeline."
      }, { status: 200 });
    }

    // If other content is flagged, provide a gentle response
    if (flagged) {
      return NextResponse.json({
        severity: "moderate",
        message: "I noticed your entry contains some intense emotions. While I can't provide specific feedback on this content, please remember that support is available if you need it."
      }, { status: 200 });
    }

    // Step 2: Generate AI response using Chat Completions
    const systemPrompt = `You are a compassionate journaling assistant for a mental wellness app called MindSoothe Journal. Your role is to provide gentle, supportive responses to journal entries.

IMPORTANT: Always return a valid JSON object with exactly this format:
{
  "mood": "string (one word describing the primary emotion, e.g., 'Anxious', 'Happy', 'Calm', 'Stressed', 'Reflective', 'Sad', 'Hopeful')",
  "reflection": "string (2-3 sentences of empathetic, supportive reflection on their entry. Be warm, understanding, and validating)",
  "suggestions": ["string", "string", "string"] (exactly 3 practical, gentle suggestions for self-care or coping strategies),
  "severity": "none"
}

Guidelines:
- Be empathetic and non-judgmental
- Focus on validation and gentle encouragement
- Suggest practical, achievable self-care activities
- Keep suggestions positive and actionable
- Avoid giving medical or therapeutic advice
- Use warm, supportive language
- The mood should be a single descriptive word
- Reflection should acknowledge their feelings and provide gentle support`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'AI service unavailable, please try again later.' },
        { status: 503 }
      );
    }

    // Parse the AI response (be defensive: choices may be undefined)
    const aiResponse = completion?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('OpenAI completion object malformed:', { completion });
      return NextResponse.json(
        { error: 'AI service returned an empty or malformed response, please try again.' },
        { status: 503 }
      );
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI Response was:', aiResponse);
      
      // Fallback response if parsing fails
      parsedResponse = {
        mood: "Reflective",
        reflection: "Thank you for sharing your thoughts with me. Your willingness to reflect and express yourself is a positive step in your wellness journey.",
        suggestions: [
          "Take a few deep breaths and center yourself",
          "Practice self-compassion and be kind to yourself",
          "Consider what small positive action you could take today"
        ],
        severity: "none"
      };
    }

    // Validate the parsed response structure
    if (!parsedResponse.mood || !parsedResponse.reflection || !Array.isArray(parsedResponse.suggestions)) {
      console.error('Invalid AI response structure:', parsedResponse);
      
      // Fallback response
      parsedResponse = {
        mood: "Reflective",
        reflection: "Thank you for sharing your thoughts with me. Your willingness to reflect and express yourself is a positive step in your wellness journey.",
        suggestions: [
          "Take a few deep breaths and center yourself",
          "Practice self-compassion and be kind to yourself",
          "Consider what small positive action you could take today"
        ],
        severity: "none"
      };
    }

    // Step 3: Save to MongoDB
    try {
      await connectDB();
      
      const journalEntry = new Journal({
        text,
        mood: parsedResponse.mood,
        reflection: parsedResponse.reflection,
        suggestions: parsedResponse.suggestions,
        severity: parsedResponse.severity || "none"
      });

      const savedEntry = await journalEntry.save();
      
      // Return the saved entry with AI response
      return NextResponse.json({
        id: savedEntry._id,
        mood: savedEntry.mood,
        reflection: savedEntry.reflection,
        suggestions: savedEntry.suggestions,
        severity: savedEntry.severity,
        createdAt: savedEntry.createdAt
      }, { status: 200 });

    } catch (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { error: 'Unable to save journal entry' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error in journal API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred, please try again later.' },
      { status: 500 }
    );
  }
}