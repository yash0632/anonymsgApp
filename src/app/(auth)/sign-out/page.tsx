"use client"
import React from 'react'
import { useToast } from '@/hooks/use-toast'
import {useSession,signOut} from 'next-auth/react'
import {useRouter} from 'next/navigation'

const SignOut = () => {
    const {toast} = useToast();
    const session = useSession();
    const router = useRouter();

    
    if(!session.data || !session.data.user){
        router.replace('/sign-in')
    }

    React.useEffect(()=>{
        function signOutFunc(){
            
            signOut().then((res)=>{
                console.log(res);
                toast({title:"signed Out Successfully"})
            })
            
        }
        if(session.data && session.data.user){
            signOutFunc();
        }
        
        
    },[])

    

    
    
    
  return (
    <div>
        
    </div>
  )
}

export default SignOut