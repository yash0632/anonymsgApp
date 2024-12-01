import mongoose,{Schema} from 'mongoose'

export interface Message {
    content:string
    createdAt:Date
}

const MessageSchema = new Schema<Message>({
    content:{
        type:String,
        required:true,
        

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    }
})




export interface User{
    username:string;
    email:string;
    password:string
    verifyCode:string
    verifyCodeExpiry:Date
    isAcceptingMessage:boolean
    isVerified:boolean
    messages:Message[]
}

const UserSchema = new Schema<User>({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Provide Correct Email address"]
    },
    password:{
        type:String,
        required:[true,"Please Provide Password"],

    },
    verifyCode:{
        type:String,
        required:[true,"Please Provide Verify Code"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verify Code Expiry is Required']
    },
    isAcceptingMessage:{
        type:Boolean,
        required:true,
    },
    isVerified:{
        type:Boolean,
        required:true
    },
    messages:[MessageSchema]
})

const UserModel =(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema);


export default UserModel;