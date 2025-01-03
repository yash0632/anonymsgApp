import {z} from 'zod'
import { usernameSchema } from './sign_up_schema'

export const messageSchema = z.object({
    content:z
            .string()
            .min(10,{message:"Content should be atleast 10 words"})
            .max(250,{message:"Content should be atmost 250 words"})
})

export const sendMessageSchema = z.object({
    username:usernameSchema,
    messageBody:messageSchema
})