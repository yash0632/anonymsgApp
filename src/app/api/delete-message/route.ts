import deleteMessageSchema from "@/schemas/delete_message";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";


export  async function POST(request:Request){
    try{
        const session = await getServerSession(authOptions);

        if(!session || !session.user || !session?.user._id){
            throw new Error("User is not Authenticated")
        }

        const userId = session.user._id;

        const requestBody = await request.json();
        const deleteMessageSchemaResponse = deleteMessageSchema.safeParse(requestBody);

        if(!deleteMessageSchemaResponse.success){
            return Response.json({
                Success:false,
                Message:deleteMessageSchemaResponse.error.issues[0].message
            },{status:400})
        }

        const messageId = deleteMessageSchemaResponse.data.MessageId;

        const user = await UserModel.findById(userId);
        if(user == null){
            throw new Error("User Is not Present")
        }
        const userMessages = user.messages;
        
        const newUserMessages = userMessages.filter((message)=>{
            //@ts-ignore
            return message._id != messageId
        })
        

        await UserModel.findByIdAndUpdate(userId,{
            messages:newUserMessages
        })
        
        
        return Response.json({
            Success:true,
            Message:"Message Deleted"
        })


    }
    catch(err){
        const error = err as Error
        return Response.json({
            Success:false,
            Message:error.message
        })
    }
    

}