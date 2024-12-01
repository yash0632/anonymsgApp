import { sendVerificationEmail } from "@/helpers/send_verification_email";
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

export async function POST(request:Request){
    try{
        await dbConnect();
        const {username,password,email} =await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        });

        if(existingUserVerifiedByUsername){
            Response.json({
                success:false,
                message:"User is Alreday signed up"
            },{
                status:400
            })
        }
        const existingUserByEmail = await UserModel.findOne({email:email})
        if(existingUserByEmail){
            //todo
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email"
                })
            }
            existingUserByEmail.password =await bcrypt.hash(password,10);
            const expiryDate =new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            existingUserByEmail.verifyCodeExpiry = expiryDate;

            existingUserByEmail.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            await existingUserByEmail.save();
        }
        else{
            const hashedPassword =await bcrypt.hash(password,10);
            const expiryDate =new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            
            const newUser = new UserModel({
                username,
                password:hashedPassword,
                email,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                isVerified:false,
                messages:[]
            })
            await newUser.save();
        }

        //send Verification Email
        const emailResponse = await sendVerificationEmail(email,verifyCode,username);
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:201})
        }
        return Response.json({
            success:true,
            message:"user Registered Successfully! Please Verify Your Email!"
        })
        
    }
    catch(err){
        return Response.json({
            success:false,
            message:'Error Registering User'
        })
    }
}


//sign up ->
/*

    ExistingUser
        Verified
*/