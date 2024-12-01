import { NextAuthOptions } from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'

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
            async authorize(credentials:any){
                const user = await UserModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })

                if(!user){
                    throw new Error("User with given Email not Present")
                }

                const checkPassword = bcrypt.compare(credentials.password,user.password);
                if(!checkPassword){
                    throw new Error("Password is not Correct!")
                }
                return user;
            }
        })
        
    ],
    callbacks: {
        async jwt({ token, user}) {
            console.log(user);
            return token
        },
        async session({ session, user, token }) {
          return session
        }
        
    },
    pages:{
        signIn:'/sign-in'
    },
    secret:process.env.NEXTAUTH_SECRET,
    
}