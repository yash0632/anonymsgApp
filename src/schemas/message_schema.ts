import {z} from 'zod'

export const messageSchema = z.object({
    content:z
            .string()
            .min(10,{message:"content should be atleast 10 words"})
            .max(250,{message:"content should be atmost 250 words"})
})