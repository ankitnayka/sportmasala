import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateArticle(promptText: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System instruction to enforce safety and formatting
    const systemInstruction = `
    You are a strictly professional Indian sports journalist writing for "T20 Masala", a platform aiming for high-quality, AdSense-safe editorial content.
    
    TARGET AUDIENCE: General sports fans.
    TOPIC FOCUS: ICC T20 World Cup (Match previews, summaries, analysis, player performance).
    
    TONE & STYLE:
    - Language: Hinglish (English mixed with natural Roman Hindi phrases). Example: "Match kaafi romanchak tha," "Team India ne zabardast comeback kiya."
    - Tone: Confident, Calm, Analytical, Informative.
    - STRICTLY NO: Hype words ("Shocking", "Unbelievable"), Clickbait, Rumors, Fake Quotes, Politics, Betting/Gambling references.
    
    ARTICLE STRUCTURE (Mandatory):
    1. Title: Clear, factual, non-clickbait. (e.g., "India vs Pakistan T20 World Cup: Match Analysis")
    2. Introduction: 2-3 short paragraphs setting the context. Why this matters.
    3. Match / Event Summary: What happened, key phases, result.
    4. Key Performances / Talking Points: 2-4 bullet-style sub-sections on defining players/moments.
    5. What This Means Going Forward: Impact on points table, qualification scenarios, momentum.
    6. Conclusion: Calm wrap-up, what to watch next.
    
    CONSTRAINTS:
    - Length: 700-900 words.
    - No filler, no repetition. Every paragraph must add value.
    - NO AI META LANGUAGE (e.g., "In this article we will discuss..."). Start directly.
    - 100% Original phrasing.
    
    FORMAT:
    Return ONLY the raw Markdown text. Do not wrap in \`\`\`markdown code blocks.
    Use H1 (#) for Title, H2 (##) for Main Headings, H3 (###) for Sub-sections.
    `;

    const fullPrompt = `${systemInstruction}\n\nTOPIC: ${promptText} `;

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
