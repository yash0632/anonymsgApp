"use client";
import React from "react";
import MessageCard from "@/components/MessageCard";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";

import z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/api_response";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useForm, SubmitHandler } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/accept_message_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const DashBoardPage = () => {
  const session = useSession();
  const { toast } = useToast();

  const [messages, setMessages] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isMessagesEmpty, setIsMessagesEmpty] = React.useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = React.useState(false);
  const { register, watch, setValue } = useForm<
    z.infer<typeof acceptMessageSchema>
  >({
    defaultValues: {
      acceptMessages: true,
    },
  });

  const acceptMessages = watch("acceptMessages");

  React.useEffect(() => {
    if (
      session.status != "loading" &&
      session.data != null &&
      session.data.user != null
    ) {
      fetchAcceptMessageStatus();
      getMessages();
    }
  }, [session]);

  React.useEffect(() => {
    fetchAcceptMessageStatus();
  }, [setValue]);

  async function getMessages() {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-messages");
      //console.log(response.data);
      setMessages(response.data.Message);
      setIsMessagesEmpty(false);
      
    } catch (err) {
      const error = err as AxiosError;

      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiResponse;
        if (errorData.Message == "No Messages") {
          setIsMessagesEmpty(true);
          setIsLoading(false);
        } else {
          toast({
            title: errorData.Message,
          });
          setIsError(true);
        }
        setIsError(true);
      }
    }
    finally{
      setIsLoading(false);
    }
  }

  async function fetchAcceptMessageStatus() {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get(`/api/accept-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessage);
      
    } 
    catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiResponse;
        toast({
          title: errorData.Message,
          description: errorData.Error,
        });
      }
      setIsError(true);
    }
    finally{
      setIsSwitchLoading(false);
    }
  }

  const handleAcceptMessageChange = async () => {
    try {
      setIsSwitchLoading(true);
      setValue("acceptMessages", !acceptMessages);
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiResponse;
        toast({
          title: errorData.Message,
          description: errorData.Error,
        });
      }
    }
    finally{
      setIsSwitchLoading(false);
    }
  };

  



  if (session.status == "loading" || isLoading == true) {
    return <Loader2 className="animate-spin" />;
  }

  if (isError) {
    return <div>404 Error</div>;
  }
  console.log(window.location);
  console.log(session.data?.user.username);

  return (
    <div>
      <div className="p-2 min-h-screen space-y-4">
        <div className="w-full text-center text-2xl font-semibold space-y-4">
          <div className="p-4 bg-neutral-100 ">DashBoardPage</div>
        </div>

        <div className="mx-24">
          <div>
            Copy Your Unique Link
          </div>
          <div className="bg-neutral-200 p-2 flex justify-between items-center rounded-md">
              <div className="text-md font-medium">
                  {`${window.location.protocol}//${window.location.hostname}:${window.location.port}/say/${session.data?.user.username}`}
              </div>
              <div>
                <Button onClick={async()=>{
                  try{
                    await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/say/${session.data?.user.username}`)

                  }
                  catch(error:any){
                    toast({
                      title:"user URL is not being copied"
                    })
                  }
                }}>
                  Copy
                </Button>
              </div>
          </div>
        </div>

        <div className="ml-24 flex flex-start space-x-2">
          <div >
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleAcceptMessageChange}
            disabled={isSwitchLoading}
          ></Switch>
          </div>
          <div className="text-md ">
              Accept Messages : {acceptMessages == true ? 'On' : 'Off'}
          </div>
        </div>

        <div className="ml-24">
          <Button onClick={()=>{
            getMessages();
          }} className={`disabled=${isLoading}`}>
            <ReloadSvg/>
          </Button>
            
        </div>
        <div>
          <Separator />
        </div>
        <div>
          {isMessagesEmpty ? (
            <NoMessageComponent />
          ) : (
            <MessageComponent
              messages={messages}
              toast={toast}
            ></MessageComponent>
          )}
        </div>
      </div>
    </div>
  );
};

function NoMessageComponent() {
  return (
    <div className="w-full text-center mt-8">
      <span className="px-8 py-4 rounded-md bg-red-200 font-medium">
        No Messages
      </span>
    </div>
  );
}

function MessageComponent({ messages, toast }: { messages: any; toast: any }) {
  const [deleteMessageId, setDeleteMessageId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (deleteMessageId != null) {
      async function deleteMessage() {
        try {
          const response = await axios.post(`/api/delete-message`, {
            MessageId: deleteMessageId,
          });
          toast({
            title: "Message Deleted",
          });
          setDeleteMessageId(null);
        } catch (err) {
          //@ts-ignore
          const error = err.response.data as ApiResponse;
          toast({
            title: error.Message,
          });
        }
      }
      deleteMessage();
    }
  }, [deleteMessageId]);

  return (
    <div className="grid grid-cols-2 mx-16 p-8 gap-x-16 gap-y-8">
      {messages.map((message: any) => (
        <MessageCard
          key={message._id}
          cardContent={message.content}
          createdAt={message.createdAt}
          messageId={message._id}
          setDeleteMessageId={setDeleteMessageId}
        ></MessageCard>
      ))}
    </div>
  );
}


const ReloadSvg=()=>{
  return (
    
    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
    
  )
}

export default DashBoardPage;
