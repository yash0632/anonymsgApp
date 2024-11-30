import {z} from 'zod'

const usernameSchema = z
    .string()
    .min(2,'Username must be atleast 2 characters')
    .max(20,'Username must be atmost 20 characters')
    .regex(/^[a-zA-Z0-9 ]*$/,"username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameSchema,
    email:z.string().email({message:"Invalid Email Address!"}),
    password:z.string().min(12,{message:"password must be atleast 12 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,}$/,"username must contain atleast one special character,one lowercase,one uppercase")
})