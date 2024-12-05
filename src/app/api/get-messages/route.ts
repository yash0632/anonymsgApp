import {getServerSession} from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/option'
import { dbConnect } from '@/lib/dbConnect'
import UserModel,{User} from '@/model/User'
import mongoose from 'mongoose'


export async function GET(){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({
                Success:true,
                Error:"User is Not Authenticated"
            },{
                status:401
            })
        }


        const userId = new mongoose.Types.ObjectId(session.user._id)

        const user = await UserModel.aggregate([
            {
                '$match':{
                    _id:userId
                }
            },
            {
                '$unwind':'$messages'
            },
            {
                '$sort':{
                    'messages.createdAt' : -1
                }
            },
            {
                '$group':{
                    _id:userId,
                    messages:{
                        '$push':'$messages'
                    }
                }
            }

        ])
        if (!user || user.length === 0) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
        }
        

        const userMessages = user[0].messages;
        return Response.json({
            Success:true,
            Messages:userMessages
        },{status:200})
    }catch(err){
        return Response.json({
            Success:false,
            Error:"Internal Server Error",
            Message:"Error in getting Messages"
        },{status:500})
    }
}

//backend -> jo data chahie vo mujhe mile
//frontend -> usko user ke preference ki tarah dikhana aur flow of api calling