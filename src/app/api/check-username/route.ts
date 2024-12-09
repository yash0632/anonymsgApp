import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User'
import { useParams } from 'next/navigation';
import { usernameSchema } from '@/schemas/sign_up_schema';


export async function GET(request:Request){
    const url = new URL(request.url);

    const {searchParams} = url;
    const encodedUsername = searchParams.get("username");
    if(encodedUsername == null){
        return Response.json({
            Success:false,
            Message:"Username Not Sent"
        },{status:400})
    }

    const username=decodeURI(encodedUsername);
    

    const usernameSchemaResponse = usernameSchema.safeParse(username);
    if(!usernameSchemaResponse.success){
        
        return Response.json({
            Success:false,
            Message:usernameSchemaResponse.error.issues[0].message
        },{status:400})
    }

    
    
    try{
        await dbConnect();
        const user = await UserModel.findOne({username:username,isVerified:true});
        console.log("code here:",user);
        if(user == null){
            //console.log("username not present")
            return Response.json({
                Success:false,
                Message:"Username is not Present"
            },{status:404})
        }
        
        return Response.json({
            Success:true,
            Message:"Username is Presesnt"
        },{status:200})

    }
    catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error"
        },{status:500})
    }
}