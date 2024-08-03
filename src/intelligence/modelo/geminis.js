import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { behavior } from "../prompt/geminis.prompt";
import { invoke } from "@tauri-apps/api";


export const geminis = async (messages) => {
    /* console.log(`este es el mensaje que resive la ia para procesar: ${orden}`) */
    const API_KEY_GOOGLE = await invoke("read_api_key")
    if(!API_KEY_GOOGLE) return alert("API KEY NOT FOUND");
    

    const google = createGoogleGenerativeAI({
        apiKey: API_KEY_GOOGLE,
    });

    const system = await behavior();
    
    try {
        const { object } = await generateObject({
            model: google("models/gemini-1.5-flash-latest", {
                safetySettings: [
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                ]
            }),
            system,
            mode: 'json',
            schema: z.object({
                data: z.object({
                    response: z.string(),
                    commands: z.array(z.string())
                })
            }),
            messages
        })
        console.log(object)
        return object;
    } catch (error) {
       alert(error)
       return console.log(error)
    }
}