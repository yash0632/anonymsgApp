"use client";
import React, { useState } from "react";
import { signInSchema } from "@/schemas/sign_in_schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const [password, setPassword] = useState<string>();
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try{

    }
    catch(err){

    }
  }
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-between items-center gap-y-4">
          <div>
            <p className="font-bold text-lg">
              Sign In
            </p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email</FormLabel>
                      <FormControl>
                        <Input placeholder="username/email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex p-2 border-[0.5px] border-solid border-black border-opacity-10 rounded-md focus-within:outline-2 focus-within:outline-solid focus-within:outline-black focus-within:rounded-md focus:border-opacity-100" >
                          <input placeholder="password" className="focus-visible:outline-none focus-visible:border-none placeholder:text-muted-foreground placeholder:text-sm" type={passwordType} onChange={(e)=>{
                            field.onChange(e)
                            setPassword(e.target.value)
                          }} />
                          <PasswordCheckButton
                            passwordType={passwordType}
                            setPasswordType={setPasswordType}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button>
                  Sign In
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

function PasswordCheckButton({
  passwordType,
  setPasswordType,
}: {
  passwordType: string;
  setPasswordType: any;
}) {

  function changePasswordType(){
    if(passwordType == "text"){
      setPasswordType("password")
    }
    else if(passwordType == "password"){
      setPasswordType("text")
    }
  }


  return ( 
    <button onClick={changePasswordType}>
      {passwordType == "password" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      )}
    </button>
  );
}
