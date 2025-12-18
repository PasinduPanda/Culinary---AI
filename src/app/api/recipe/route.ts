import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "GOOGLE_API_KEY is not set in environment variables." },
            { status: 500 }
        );
    }

    try {
        const { dish, country } = await request.json();

        if (!dish || !country) {
            return NextResponse.json(
                { error: "Dish and Country are required." },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-002",
            tools: [
                {
                    googleSearch: {},
                } as any,
            ],
        });

        const prompt = `Find an authentic recipe for ${dish} from ${country}. 
    Provide the following details in a structured JSON format (but return the response as plain text/markdown suitable for rendering, or just structured text I can parse, actually let's stick to a nice markdown response with citations):
    1. Title of the Dish
    2. Brief description/history
    3. Ingredients list with measurements
    4. Step-by-step cooking instructions
    5. Nutritional information per serving (Calories, Protein, Carbs, Fat)
    6. Tips for authenticity
    
    Ensure the source grounding metadata is available for citations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract grounding metadata if available (it enables citations)
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

        return NextResponse.json({
            text,
            groundingMetadata,
        });
    } catch (error) {
        console.error("Error generating recipe:", error);
        return NextResponse.json(
            { error: "Failed to generate recipe. Please try again." },
            { status: 500 }
        );
    }
}
