import { generate } from "@genkit-ai/ai"
import { gemini15Flash } from "@genkit-ai/googleai"


export const firebaseIA = async (order) => {
    try {
        const llmResponse = await generate({
            model: gemini15Flash,
            prompt: order
        });
        return llmResponse;
    } catch (error) {
        console.error(error);
    }
}