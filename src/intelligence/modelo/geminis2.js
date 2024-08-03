import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { invoke } from "@tauri-apps/api";
import { generateObject, generateText, streamText } from "ai";



export const geminis2 = async (messages) => {
    /* console.log(`este es el mensaje que resive la ia para procesar:`, messages) */

    const API_KEY_GOOGLE = await invoke("read_api_key")
    if(!API_KEY_GOOGLE) return alert("API KEY NOT FOUNT");

    const google = createGoogleGenerativeAI({
        apiKey: API_KEY_GOOGLE,
    })

    try {
        const response = await generateText({
            model: google("models/gemini-1.5-flash-latest"),
            system:"contestame en español las preguntas",
            messages
        })
        console.log(response.text)
        return response;
    } catch (error) {
       alert(error)
       return console.log(error)
    }
}