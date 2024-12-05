import {z} from 'zod';
import { usernameSchema } from './sign_up_schema';

export const verifySchema = z.object({
    username:usernameSchema,
    code : z.string().length(6,"Verification Code must be 6 digits")
})