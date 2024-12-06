import { sendVerificationEmail } from "@/helpers/send_verification_email";
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

export async function POST(request:Request){
    try{
        await dbConnect();
        const {username,password,email} =await request.json();
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        });

        if(existingUserVerifiedByUsername){
            return Response.json({
                Success:false,
                Message:"User is Already signed up and verified"
            },{
                status:400
            })
        }
        const existingUserByEmail = await UserModel.findOne({email:email})
        if(existingUserByEmail){
            //todo
            if(existingUserByEmail.isVerified){
                return Response.json({
                    Success:false,
                    Message:"User already exists with this email"
                },{status:200})
            }
            existingUserByEmail.username = username;
            existingUserByEmail.password =await bcrypt.hash(password,10);
            const expiryDate =new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            existingUserByEmail.verifyCodeExpiry = expiryDate;
            
            existingUserByEmail.verifyCode = verifyCode;

            await existingUserByEmail.save();
        }
        else{
            const hashedPassword =await bcrypt.hash(password,10);
            const expiryDate =new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            
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
        if(!emailResponse.Success){
            return Response.json({
                Success:false,
                Message:emailResponse.Error
            },{status:201})
        }
        return Response.json({
            Success:true,
            Message:"user Registered Successfully! Please Verify Your Email!"
        })
        
    }
    catch(err){
        return Response.json({
            Success:false,
            Error:'Error Registering User'
        })
    }
}


//sign up ->
/*

    ExistingUser
        Verified
*/