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
        function signOutFunc(){
            
            signOut().then((res)=>{
                console.log(res);
                toast({title:"signed Out Successfully"})
            })
            
        }
        signOutFunc();
        
    },[])

    React.useEffect(()=>{
        if(!session.data?.user){
            router.replace('/sign-in')
        }
    },[session])

    
    
    
  return (
    <div>
        
    </div>
  )
}

export default SignOut