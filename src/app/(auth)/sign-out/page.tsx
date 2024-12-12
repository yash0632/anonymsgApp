"use client"
import React from 'react'
import { useToast } from '@/hooks/use-toast'
import {useSession,signOut} from 'next-auth/react'
import {useRouter} from 'next/navigation'

const SignOut = () => {
    const {toast} = useToast();
    const session = useSession();
    const router = useRouter();

    
    React.useEffect(()=>{
        if(session.status != "loading"){
              if(session.data){
                function signOutFunc(){
            
                  signOut().then((res)=>{
                        console.log(res);
                        toast({title:"signed Out Successfully"})
                        router.replace('/sign-in')
                  })
                    
                }
                signOutFunc();
              }
              else{
                router.replace('/sign-in')
              }
                
            
        }
    },[session])

    

    

    
    
    
  return (
    <div>
        
    </div>
  )
}

export default SignOut