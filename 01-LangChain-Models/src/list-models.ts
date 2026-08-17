import "dotenv/config";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is missing");
}

const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
);
const data = await response.json();

if (data.models) {
    const supportedModels = data.models
        .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m: any) => m.name.replace("models/", ""));

    console.log("Available generateContent models:", supportedModels);
} else {
    console.error("Error fetching models:", data);
}