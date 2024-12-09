"use client"
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import React from 'react'
import axios,{AxiosError} from 'axios'
import {useToast}  from '@/hooks/use-toast';
import { ApiResponse } from '@/types/api_response';
import { Button } from '@/components/ui/button';

const SendMessagePage = () => {
  const {username} = useParams<{username:string}>()
  const {toast} =useToast();

  const encodedUsername = encodeURIComponent(username);
  const [isUser,setIsUser] = React.useState<boolean>(true);
  const [isLoading,setIsLoading] = React.useState<boolean>(true);

  React.useEffect(()=>{
    async function getUser(){

      try{

        await axios.get(`/api/check-username?username=${encodedUsername}`)

        setIsUser(true);
      }
      catch(err){
        const error = err as AxiosError
        console.log(error);
        const errorData = error.response?.data as ApiResponse
        console.log(errorData);
        toast({
          title:errorData.Message
        })
        setIsUser(false);
      }
      finally{
        setIsLoading(false);
      }
    }
    getUser();
  },[])
  
  if(isLoading){
    return(
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center min-w-fit'>
          <Loader2 className="animate-spin"></Loader2>
        </div>
      </div>
    )
    
  }
  
  return (
    <div className='flex justify-center '>
      <div className='flex flex-col justify-center'>
        {isUser ? <UserComponent username={username} toast={toast}/> : <NotUserComponent/>}
      </div>
    </div>
  )
}

function NotUserComponent(){
  return (
    <div className="bg-red-300 flex space-x-1 items-center p-4 rounded-md mt-8">
      
      <div><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="Cross-Circled--Streamline-Radix" height={16} width={16} ><desc>{"Cross Circled Streamline Icon: https://streamlinehq.com"}</desc><path fillRule="evenodd" clipRule="evenodd" d="M0.9355466666666667 7.999872c0 -3.901536 3.1628213333333335 -7.064357333333334 7.064357333333334 -7.064357333333334S15.064213333333333 4.098336 15.064213333333333 7.999872c0 3.9014613333333332 -3.1627733333333334 7.064341333333333 -7.064309333333333 7.064341333333333S0.9355466666666667 11.901333333333334 0.9355466666666667 7.999872ZM7.999904 1.9488426666666667c-3.341888 0 -6.051018666666667 2.7091413333333336 -6.051018666666667 6.051029333333333 0 3.341888 2.709130666666667 6.0510079999999995 6.051018666666667 6.0510079999999995 3.341856 0 6.050976 -2.70912 6.050976 -6.0510079999999995 0 -3.341888 -2.70912 -6.051029333333333 -6.050976 -6.051029333333333Zm2.5105813333333336 3.540693333333333c0.20823466666666668 0.20827733333333331 0.20823466666666668 0.5459733333333333 0 0.7542506666666666L8.754271999999998 7.999989333333334l1.7562133333333332 1.7562133333333332c0.20823466666666668 0.20827733333333331 0.20823466666666668 0.5459733333333333 0 0.7542506666666666 -0.20827733333333331 0.20826666666666668 -0.5459733333333333 0.20826666666666668 -0.7542506666666666 0L8.000021333333333 8.754240000000001 6.243818666666667 10.510453333333334c-0.20827733333333331 0.20826666666666668 -0.5459733333333333 0.20826666666666668 -0.7542506666666666 0 -0.20827733333333331 -0.20827733333333331 -0.20827733333333331 -0.5459733333333333 0 -0.7542506666666666l1.7562133333333332 -1.7562133333333332 -1.7562133333333332 -1.7562026666666666c-0.20827733333333331 -0.20827733333333331 -0.20827733333333331 -0.5459733333333333 0 -0.7542506666666666s0.5459733333333333 -0.20827733333333331 0.7542506666666666 0l1.7562026666666666 1.7562133333333332 1.7562133333333332 -1.7562133333333332c0.20827733333333331 -0.20827733333333331 0.5459733333333333 -0.20827733333333331 0.7542506666666666 0Z" fill="#000000" strokeWidth={1} /></svg> </div>
      <div>User not present</div>
    </div>
  )
}

function UserComponent({username,toast}:Readonly<{
  username:string,
  toast:any
}>){
  const [message,setMessage] = React.useState<string>("write an anonymous message");
  

  async function handleSendMessage(){
    console.log("code here")
    try{
      const response = await axios.post(`/api/send-message`,{
        username,
        messageBody:{
          content:message
        }
      });

      toast({
        title:"Message Sent Successfully"
      })
    }
    catch(err){
      const error = err as AxiosError;
      console.log(error)
      toast({
        title:error.response?.data?.Message
      })
    }
  }

  return(
    <div className="w-96 space-y-4 flex flex-col items-center">
      <div className='w-full flex justify-center'>
        <div className="bg-neutral-100 text-base w-2/4 p-2 rounded-md flex justify-center">
          {username}
        </div>
      </div>
      

      <div className="w-full">
          <textarea name="" id="" className='w-full bg-neutral-200 h-40 text-lg focus:ring-0 focus:border-none rounded-md placeholder:text-center p-4' placeholder={message} onChange={(e)=>{
            setMessage(e.target.value);
          }}/>
      </div>

      <div className="w-full flex justify-center">
        <Button onClick={()=>
          
          handleSendMessage()
        }>
          Send Message
        </Button>
      </div>
    </div>
  )
}


export default SendMessagePage