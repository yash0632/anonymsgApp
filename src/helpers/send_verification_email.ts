import { resend } from "@/lib/resend";

import EmailTemplate from "../../emails/email_template";
import { ApiResponse } from "@/types/api_response";

export async function sendVerificationEmail(
    email:string,
    verifyCode:string,
    username:string
):Promise<ApiResponse>{
    console.log("sending verification email2")
    try{
        const { data, error } = await resend.emails.send({
            from: `${process.env.RESEND_TO_EMAIL}`,
            to: email,
            subject: 'Mystry Code | Verification Code',
            react: EmailTemplate({username,otp:verifyCode}),
        });
        if(error){
            console.log("error",error)
        }
        console.log("data:",data);
        return {
            
            Success:true,
            Message:'Verification Email sended Successfully'
        }
    }
    catch(errorEmail){
        console.log("errorEmail:",errorEmail)
        return {
            Success:false,
            Error:'Error in sending verification email'
        }
    }
}