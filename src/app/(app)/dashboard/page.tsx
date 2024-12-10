'use client'
import React from 'react'
import MessageCard from '@/components/MessageCard'
import {useSession} from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import axios,{AxiosError} from 'axios'

import z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/api_response'

const DashBoardPage = () => {
  const session = useSession();
  const {toast}= useToast();

  const [messages,setMessages] = React.useState(null);
  const [isLoading,setIsLoading] = React.useState(true);
  const [isError,setIsError] = React.useState(false);
  const [isMessagesEmpty,setIsMessagesEmpty] = React.useState(false);

  React.useEffect(()=>{
    if(session.status != "loading" && session.data != null && session.data.user != null){
      async function getMessages(){
        try{
          const response = await axios.get('/api/get-messages');
          console.log(response.data);
          setMessages(response.data.Message);
          setIsMessagesEmpty(false);
          setIsLoading(false);
          
        }
        catch(err){
          const error = err as AxiosError
          
          
          if(error.response && error.response.data){
            const errorData = error.response.data as ApiResponse
            if(errorData.Message == "No Messages"){
              setIsMessagesEmpty(true);
              setIsLoading(false);
            } 
            else{
              toast({
                title:errorData.Message
              })
              setIsError(true);
            }
          }
        }
        

      }
      getMessages()
    }
  },[session])
  if(session.status == "loading" || isLoading== true){
    return (
      <Loader2 className="animate-spin"/>
    )
  }

  if(isError){
    return (
      <div>
        404 Error
      </div>
    )
  }

  return (
    <div>
      <div className="w-full text-center text-2xl font-semibold">
        <div className="p-4 bg-neutral-100 ">
          DashBoardPage
        </div>
      </div>
      
        {isMessagesEmpty ? <NoMessageComponent/>:<MessageComponent messages={messages} toast={toast}></MessageComponent>}
      
    </div>
  )
}

function NoMessageComponent(){
  return (
    <div className="w-full text-center mt-8">
      <span className="px-8 py-4 rounded-md bg-red-200 font-medium">
         No Messages
      </span>

    </div>
  )
}

function MessageComponent({messages,toast}:{messages:any,toast:any}){
  const [deleteMessageId,setDeleteMessageId] = React.useState<string|null>(null);
  

  React.useEffect(()=>{
    if(deleteMessageId != null){
      async function deleteMessage(){
        try{
          const response = await axios.post(`/api/delete-message`,{
            MessageId:deleteMessageId
          })
          toast({
            title:"Message Deleted"
          })
          setDeleteMessageId(null);

        }
        catch(err){
          //@ts-ignore
          const error = err.response.data as ApiResponse
          toast({
            title:error.Message
          })
        }

      }
      deleteMessage();
    }
  },[deleteMessageId]);

  return(
    <div className="grid grid-cols-2 mx-16 p-8 gap-x-16 gap-y-8">
      {messages.map((message:any)=>(
        <MessageCard key={message._id} cardContent={message.content} createdAt={message.createdAt} messageId={message._id} setDeleteMessageId={setDeleteMessageId}></MessageCard>
      ))}
    </div>
  )
}


export default DashBoardPage