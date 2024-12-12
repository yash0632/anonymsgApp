'use client'

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import {useRouter} from 'next/navigation'
export default function Home() {
  const session = useSession();
  const router = useRouter();
  React.useEffect(()=>{
    if(session.data){
      router.replace('/dashbaord');
    }
    else{
      router.replace('/sign-in')
    }
  },[session])

  return (
    <div className="min-h-screen">
      
    </div>
  );
}
