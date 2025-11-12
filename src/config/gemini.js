// import {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } from "@google/generative-ai";
  
//   const MODEL_NAME = "gemini-2.0-flash";
  
//   // Paste Your API KEY Below
//   const API_KEY = "";
  
//   async function runChat(prompt) {
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
//     const generationConfig = {
//       temperature: 0.75,
//       topK: 1,
//       topP: 1,
//       maxOutputTokens: 2048,
//     };
  
//     const safetySettings = [
//       {
//         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//       {
//         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//       },
//     ];
  
//     const chat = model.startChat({
//       generationConfig,
//       safetySettings,
//       history: [
//       ],
//     });
  
//     const result = await chat.sendMessage(prompt);
//     const response = result.response;
//     return response.text();
//   }
  
//   export default runChat;
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";

const API_KEY = "{api key}"; 

async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.75,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    // Initialize the persistent chat session outside the function
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [], 
    });

    /**
     * Sends a message to the persistent chat session and returns the response text.
     * @param {string} prompt - The user's input prompt.
     * @returns {Promise<string>} - The response text from the model.
     */
        try {
            // const result = await chat.sendMessage({ message: prompt });
            // return result.text;
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Sorry, I encountered an error connecting to the AI service.";
        }
}

export default runChat;