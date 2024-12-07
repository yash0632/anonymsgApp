"use client";

import * as React from "react";
import { useParams } from "next/navigation";



import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Loader2 } from "lucide-react";
import axios,{AxiosError} from 'axios';
import { ApiResponse } from "@/types/api_response";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const verifyCode = () => {
  const params = useParams<{ username: string }>();
  const { username } = params;
  const encodedUsername = encodeURIComponent(username);
  const[value,setValue] = React.useState("");
  const [isSubmitting,setIsSubmitting] = React.useState(false);
  const{ toast} = useToast();
  const router = useRouter();
  

  async function handleSubmit() {
    setIsSubmitting(true);
    try{
        const response = await axios.post('/api/verify-code',{
            encodedUsername,
            code:value
        })
            
        toast({
            title: response.data.Message
        })
            
        setTimeout(()=>{
            router.replace(`/sign-in`)
        },1500)   
        
        
    }
    catch(err){
        
    
        const error = err as AxiosError<ApiResponse>
        toast({
            title:error.response?.data.Message,
            
        })
        if(error.response?.data.Message == "User With given Username is not present"){
            setTimeout(()=>{
                router.replace('/sign-up')
            })
        }
        
    }
    finally{
        
        setIsSubmitting(false);
        
    }
  }
  return (
    <div className="min-h-screen flex justify-center w-full">
      <div className=" p-4 flex flex-col justify-center">
        
            <form onSubmit={(e)=>{
                e.preventDefault();
                handleSubmit();
            }}
            className="flex flex-col justify-between items-center gap-y-4" >
                <div>
                    <p className="font-semibold">
                        Enter your one-time password
                    </p>
                </div>
                <div className='space-y-2'>

                    <InputOTP
                        maxLength={6}
                        value = {value}
                        pattern={REGEXP_ONLY_DIGITS}
                        onChange={(value)=>setValue(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0}></InputOTPSlot>
                            <InputOTPSlot index={1}></InputOTPSlot>
                            <InputOTPSlot index={2}></InputOTPSlot>
                            <InputOTPSlot index={3}></InputOTPSlot>
                            <InputOTPSlot index={4}></InputOTPSlot>
                            <InputOTPSlot index={5}></InputOTPSlot>
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <div>
                    <Button disabled={value.length!=6} type="submit">
                        {isSubmitting ?  <Loader2 className="animate-spin"></Loader2> : 'Submit'}
                    </Button>
                </div>
            </form>
        
      </div>
    </div>
  );
};

export default verifyCode;
