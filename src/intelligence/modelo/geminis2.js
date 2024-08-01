import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { generateObject, generateText, streamText } from "ai";
import { behavior } from "../prompt/geminis.prompt";

const google = createGoogleGenerativeAI({
    apiKey: "AIzaSyBFZvgFafnHyxcT3yVZat4C2HkBQoiynnc",
})

export const geminis2 = async (messages) => {
    console.log(`este es el mensaje que resive la ia para procesar:`, messages)
    /* console.log(`este es el prompt`,system) */
    try {
        const response = await generateText({
            model: google("models/gemini-1.5-flash-latest"),
            system:"contestame en español las preguntas",
            messages
        })
        console.log(response.text)
        return response;
    } catch (error) {
       return console.log(error)
    }
}