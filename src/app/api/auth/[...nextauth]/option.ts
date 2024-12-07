import { NextAuthOptions } from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/dbConnect'

export const authOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credential",
    
            credentials:{
                email:{
                    label:"username",
                    type:"text"
                },
                password:{
                    label:"password",
                    type:"password"
                }
            },
            //@ts-ignore
            async authorize(credentials:any){
                console.log("credentials:",credentials);
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
    
                    if(!user){
                        console.log("error")
                        throw new Error("User with given Email not Present")
                        
                    }
    
                    const checkPassword = bcrypt.compare(credentials.password,user.password);
                    if(!checkPassword){
                        throw new Error("Password is not Correct!")
                        
                    }
                    return user;
                }
                catch(err:any){
                    throw new Error(err?.message ?? "Oops, something went wrong!")
                    
                }
                
            }
        })
        
    ],
    
    callbacks: {
        
        async jwt({ token, user}) {
            
            if(user){
                console.log(user);
                token.username = user.username;
                token.email = user.email
                token._id = user._id;
            }
            
            
            return token
        },
        async session({ session,  token }) {
            
            session.user._id = token._id
            session.user.username = token.username
            session.user.email = token.email
            

          return session
        }
        
    },
    
    secret:process.env.NEXTAUTH_SECRET,
    session:{
        strategy:"jwt"
    },
    pages:{
        signIn:"/sign-in"
    }
    
}