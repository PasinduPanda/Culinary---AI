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
            model: "gemini-2.5-flash",
            tools: [
                {
                    googleSearch: {},
                } as any,
            ],
        });

        const prompt = `Find an authentic recipe for ${dish} from ${country}. 
        Return the response AS A SINGLE JSON OBJECT strictly matching this structure:
        {
          "title": "Dish Name",
          "description": "Short history/description",
          "prepTime": "e.g. 20 min",
          "cookTime": "e.g. 45 min",
          "servings": 4,
          "tips": [
            { "id": "t1", "text": "Tip text" }
          ],
          "steps": [
            { "number": 1, "instruction": "Step instruction" }
          ]
        }
        
        Ensure the data is grounded in real authentic sources. No markdown outside the JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // More robust JSON extraction
        let jsonString = text;
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            jsonString = match[0];
        }

        let recipeData;
        try {
            recipeData = JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error. Full text:", text);
            throw new Error("Failed to parse recipe data. The AI returned an invalid format.");
        }


        // Extract grounding metadata if available (it enables citations)
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

        return NextResponse.json({
            recipe: recipeData,
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
