import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Tu es LilyGo, l'assistant AI d'un service de transport VIP premium en France. LilyGo propose des services de chauffeurs certifiés, véhicules haut de gamme, et réservations en ligne pour des trajets simples ou à l'heure. Réponds de manière professionnelle, helpful, et en français. Si la question n'est pas liée au transport, redirige poliment vers nos services.

Question de l'utilisateur: ${message}

Réponse:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), { status: 200 });
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
