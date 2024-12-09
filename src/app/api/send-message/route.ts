import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { sendMessageSchema } from "@/schemas/message_schema";




export async function POST(request:Request){

    try{    
        const body = await request.json();
        console.log(body);
        const sendMessageSchemaResponse = sendMessageSchema.safeParse(body);
        if(!sendMessageSchemaResponse.success){
            console.log(sendMessageSchemaResponse.error.issues)
            return Response.json({
                Success:false,
                Message:sendMessageSchemaResponse.error.issues[0].message
            },{status:400})
        }

        const {username,messageBody} = sendMessageSchemaResponse.data;
        await dbConnect();
        const user = await UserModel.findOne({username});


        if(!user){
            return Response.json({
                Success:false,
                Message:"Username is not present in database"
            },{status:404})
        }

        const {isAcceptingMessage } = user;
        if(isAcceptingMessage == false){
            return Response.json({
                Success:false,
                Message:`User with Username ${username} is not accepting Messages!`
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
            Success:true,
            Message:`Message is sent to ${username}`
        },{status:200})
    }
    catch(err){
        return Response.json({
            Success:false,
            Message:"Internal Server Error"
        },{status:500});
    }
    
}