import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

//AI Text Search
export const findProductsWithText = async (userPrompt, productsList) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const simplifiedCatalog = productsList.map(item => `ID: ${item.id}, Name: ${item.name}, Description: ${item.lore}`);
    
    const prompt = `
      You are a brilliant shopping assistant for a video game merchandise store.
      Here is our current inventory:
      ${JSON.stringify(simplifiedCatalog)}

      The user is looking for this vibe or item: "${userPrompt}"

      Find the 3 items that best match their request. 
      You MUST reply with ONLY a valid JSON array containing the 3 product IDs. 
      Do not include any extra text. Example output: ["rel-001", "rel-012", "rel-005"]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Text Search Failed:", error);
    return []; 
  }
};

//AI image search
export const findProductsWithImage = async (base64Image, mimeType, productsList) => {
  try {
    // uses the exact same  model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // I gived it the same simplified catalog
    const simplifiedCatalog = productsList.map(item => `ID: ${item.id}, Name: ${item.name}, Description: ${item.lore}, Category: ${item.category}`);

    // I changed the instructions slightly to tell it to look at the picture
    const prompt = `
      You are a visual shopping assistant for a video game merchandise store.
      Here is our current inventory:
      ${JSON.stringify(simplifiedCatalog)}

      Look at the provided image. Find the 3 items in our inventory that visually match the object, theme, or vibe of this image.
      You MUST reply with ONLY a valid JSON array containing the 3 product IDs. 
      Do not include any extra text. Example output: ["rel-001", "rel-012", "rel-005"]
    `;

    // Packages the image data so Gemini can read it
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    // Send both the prompt and the picture to the AI
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Image Search Failed:", error);
    return []; 
  }
};