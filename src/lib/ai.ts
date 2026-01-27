import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateArticle(promptText: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // System instruction to enforce safety and formatting
    const systemInstruction = `
    You are a professional sports journalist for "T20 Masala".
    Your Goal: Write a high-quality, engaging article based on the user's prompt.
    
    TONE & STYLE:
    - Language: Hinglish (English mixed with common Hindi words like "Zabardast", "Mauka", "Jeet", "Haar").
    - Tone: Neutral, factual, but energetic (Excited for sports).
    - No Clickbait: Do not use misleading titles.
    - Safe: No hate speech, political bias, or controversial opinions.
    
    FORMAT (You must return this structure in Markdown):
    
    # [Catchy Title Here]
    
    **[Engaging 30-word excerpt]**
    
    [Introduction paragraph]
    
    ## Match Highlights / Key Details
    [Body paragraphs]
    
    ## Turning Point
    [Analysis]
    
    ## What's Next?
    [Conclusion]
    
    Do NOT include markdown code blocks (like \`\`\`markdown). Just return the raw text.
    `;

    const fullPrompt = `${systemInstruction}\n\nTOPIC: ${promptText}`;

    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
    }
}
