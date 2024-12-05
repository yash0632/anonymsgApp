import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameSchema } from "@/schemas/sign_up_schema";
import {z} from 'zod';


const queryParamsSchema = z.object({
    username:usernameSchema
})

export async function GET(request:Request){
    await dbConnect();

    try{
        const url = new URL(request.url);
        const {searchParams} = url;
        const queryParams = {
            username:searchParams.get("username")
        }

        const queryParamsCheck = queryParamsSchema.safeParse(queryParams);
        if(!queryParamsCheck.success){
            console.log(queryParamsCheck);
            return Response.json({
                ErrorMessage:queryParamsCheck.error.message
            },{status:405})
        }

        //check is username is unique;
        const verifiedUserWithUrlUsername = await UserModel.findOne({
            username:queryParams.username,
            isVerified:true
        })
        if(verifiedUserWithUrlUsername != null){
            return Response.json({
                Message:"Given Username is Already Present"
            },{status:405})
        }

        return Response.json({
            Message:"Username is Unique"
        },{status:200})
    }
    catch(err){
        return Response.json({
            Error:"Interal Server Error"
        },{status:400})
    }
}