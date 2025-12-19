const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const apiKey = env.match(/GOOGLE_API_KEY=(.*)/)[1].trim();

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.error("API Error:", data.error.message);
        } else {
            console.log("Available Models List (First 5):");
            data.models.slice(0, 5).forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));

            // Check specifically for gemini-1.5-flash
            const flash = data.models.find(m => m.name.includes('gemini-1.5-flash'));
            if (flash) {
                console.log("\nFound Gemini 1.5 Flash:", flash.name);
            } else {
                console.log("\nGemini 1.5 Flash NOT found for this key!");
            }
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
