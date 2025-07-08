export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ApiResponse {
  questions: QuizQuestion[];
  error?: string;
}

const API_KEY = 'bea4ab2b8e4faeff9f90202f3bc8a9618c6d6cd02b7f89b49cb2c95575082f04';
const API_URL = 'https://api.together.xyz/v1/chat/completions';
const MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo';

export async function generateQuiz(topic: string): Promise<ApiResponse> {
  try {
    const prompt = `Generate a 3-question multiple choice quiz about "${topic}". Each question must have:

4 options (A, B, C, D)
Only one correct answer
A short explanation

Respond ONLY in this exact JSON format:
[
  {
    "question": "....",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct Option",
    "explanation": "Explanation here"
  }
]`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const questions = JSON.parse(content);
    
    if (!Array.isArray(questions) || questions.length !== 3) {
      throw new Error('Invalid quiz format received');
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer || !q.explanation) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return { questions };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { 
      questions: [],
      error: error instanceof Error ? error.message : 'Failed to generate quiz'
    };
  }
}