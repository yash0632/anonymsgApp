import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verify_schema";

export async function POST(request:Request){
    await dbConnect();
    try{
        const {encodedUsername,code} = await request.json();
        const body = {
            username : decodeURIComponent(encodedUsername),
            code:code
        }
        
        const verifySchemaCheck = verifySchema.safeParse(body);
        if(!verifySchemaCheck.success){
            return Response.json({
                Success:false,
                Message:verifySchemaCheck.error.message
            },{status:500})
        }
        const user = await UserModel.findOne({username:body.username});
        if(user == null){
            return Response.json({
                Success:false,
                Message:"User With given Username is not present"
            },{status:405})
        }


        const checkOtpCode = user.verifyCode == body.code;
        if(!checkOtpCode){
            return Response.json({
                Success:false,
                Message:"Given Otp is not Correct"
            },
            {
                status:401
            })
        }
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(checkOtpCode && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            console.log("code here")
            return Response.json({
                Success:true,
                Message:"User Verified Successfully"
            },{
                status:200
            })
        }
        else{
            return Response.json({
                Success:false,
                Message:"Otp Expired.Please Sign Up again to get a new Code"
            })
        }
        
    }
    catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error",
        },{status:500})
    }
    
}