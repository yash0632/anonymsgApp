import { resend } from "@/lib/resend";

import EmailTemplate from "../../emails/email_template";
import { ApiResponse } from "@/types/api_response";

export async function sendVerificationEmail(
    email:string,
    verifyCode:string,
    username:string
):Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Code | Verification Code',
            react: EmailTemplate({username,otp:verifyCode}),
        });
        return {
            success:true,
            message:'Verification Email sended Successfully'
        }
    }
    catch(errorEmail){
        return {
            success:false,
            message:'Error in sending verification email'
        }
    }
}