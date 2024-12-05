import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { sendMessageSchema,messageSchema } from "@/schemas/message_schema";




export async function POST(request:Request){

    try{    
        const body = await request.json();
        const sendMessageSchemaResponse = sendMessageSchema.safeParse(body);
        if(!sendMessageSchemaResponse.success){
            return Response.json({
                Success:false,
                Error:'Wrong Inputs are sent',
                ErrorMessage:sendMessageSchemaResponse.error.message
            },{status:400})
        }

        const {username,messageBody} = sendMessageSchemaResponse.data;
        dbConnect();
        const user = await UserModel.findOne({username});


        if(!user){
            return Response.json({
                Success:false,
                Error:"Username is not present in database"
            },{status:404})
        }

        const {isAcceptingMessage } = user;
        if(isAcceptingMessage == false){
            return Response.json({
                Success:false,
                Error:`User with ${username} is not accepting Messages!`
            },{status:409})
        }

        const {content} = messageBody;
        const newMessage:Message = {
            content,
            createdAt:new Date()
        }
        
        user.messages.push(newMessage)
        await user.save();


        return Response.json({
            success:true,
            Message:`Message is sent to ${username}`
        },{status:200})
    }
    catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error"
        },{status:500});
    }
    
}