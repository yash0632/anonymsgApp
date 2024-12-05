import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/accept_message_schema";

export async function GET(){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({
                Success:false,
                Error:'User is not Authenticated'
            },{status:401})
        }

        const userSession = session.user;
        await dbConnect();

        const user : User | null  = await UserModel.findById(userSession._id)
        if(!user){
            return Response.json({
                Success:false,
                Error:'User is not Present in Database'
            },{status:401})
        }
        const {isAcceptingMessage} = user;

        return Response.json({
            Success:true,
            isAcceptingMessage:isAcceptingMessage
        })

    }
    catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error",
            Message:"Error in getting Accept-Message Status"
        },{status:400})
    }
}


export async function POST(request:Request){
    try{
        const body = await request.json();
        const acceptMessageSchemaResponse = acceptMessageSchema.safeParse(body);
        if(!acceptMessageSchemaResponse.success){
            return Response.json({
                Success:false,
                Error:"Input is not Correctly Defined",
                Message:acceptMessageSchemaResponse.error.message
            })
        }

        const {acceptMessages} = acceptMessageSchemaResponse.data;
        const session =await getServerSession(authOptions);

        if(!session || !session.user){
            if(!session || !session.user){
                return Response.json({
                    Success:false,
                    Error:'User is not Authenticated'
                },{status:401})
            }
        }

        
        const userId = session.user._id
        if(!userId){
            return Response.json({
                Success:false,
                Error:'User is not Authenticated'
            },{status:401})
        }

        const user :User | null= await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new : true});
        if(!user){
            return Response.json({
                Success:false,
                Error:'User is not Present in Database'
            },{status:401})
        }

        return Response.json({
            Success:true,
            Message:"Message acceptance status Updated Successfully"
        })
    }
    catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error",
            Message:"Error in getting Accept-Message Status"
        },{status:400})
    }
}