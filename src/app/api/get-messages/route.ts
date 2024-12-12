import {getServerSession} from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/option'
import { dbConnect } from '@/lib/dbConnect'
import UserModel,{User} from '@/model/User'
import mongoose from 'mongoose'


export async function GET(){
    try{
        
        const session = await getServerSession(authOptions);
        console.log(session);
        if(!session || !session.user){
            return Response.json({
                Success:true,
                Message:"User is Not Authenticated"
            },{
                status:401
            })
        }

        
        let userId = null
        if(mongoose.isValidObjectId(session.user._id)){
            userId = new mongoose.Types.ObjectId(session.user._id)
            
        }
        else{
            
            throw new Error()
        }
        
        
        
        
        
        
        

        const user =await UserModel.aggregate([
            {
                '$match':{
                    '_id':userId
                }
            },
            {
                '$unwind':{
                    'path':'$messages'
                }
            },
            {
                '$sort':{
                    'messages.createdAt' : -1
                }
            },
            {
                '$group':{
                    '_id':userId,
                    'messages':{
                        '$push':'$messages'
                    }
                }
            }

        ]).exec();
        
        
        
        if (!user || user.length === 0) {
            return Response.json(
              { Message: 'No Messages', Success: false },
              { status: 404 }
            );
        }
        

        const userMessages = user[0].messages;
        return Response.json({
            Success:true,
            Message:userMessages
        },{status:200})
    }catch(err){
        
        return Response.json({
            Success:false,
            Message:"Internal Server Error! Please try again later"
        },{status:500})
    }
}

//backend -> jo data chahie vo mujhe mile
//frontend -> usko user ke preference ki tarah dikhana aur flow of api calling