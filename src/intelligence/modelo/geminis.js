import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { behavior } from "../prompt/geminis.prompt";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
})

export const geminis = async (messages) => {
    /* console.log(`este es el mensaje que resive la ia para procesar: ${orden}`) */
    const system = await behavior();
   /*  console.log(`este es el prompt`,system) */
    try {
        const { object } = await generateObject({
            model: google("models/gemini-1.5-flash-latest"),
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
       return console.log(error)
    }
}