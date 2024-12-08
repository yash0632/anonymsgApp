import {DefaultSession} from 'next-auth'
import {JWT} from 'next-auth/jwt'

export declare module 'next-auth'{
    interface User {
        
        username?:string,
        email?:string,
        _id:string
    }


    interface Session{
        user:{
            _id?:string,
            username?:string,
            email?:string,

        } & DefaultSession["user"]
    }
}


declare module 'next-auth/jwt'{
    interface JWT{
        email?:string,
        username?:string,
        _id:string
    }
}