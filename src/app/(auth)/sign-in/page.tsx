"use client";
import 'next-auth'
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
import axios from "axios";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const SignInPage = () => {
  const [password, setPassword] = useState<string>();
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(()=>{
    if(session.status != "loading"){
      if (session.data && session.data.user) {
        router.replace(`/`);
      }
    }
  },[session])

  

  
  

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof signInSchema>) {
    console.log(data);

    //@ts-ignore

    signIn("credentials", {
      redirect: false,
      password: data.password,
      identifier: data.identifier,
    })
      .then((res) => {
        if (res?.ok) {
          toast({
            title: "Signed In Successfully",
          });
          router.replace("/dashboard");
        } else if (res?.error) {
          toast({
            title: res?.error,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if(session.status == "loading"){
    return <Loader2 className="animate-spin"></Loader2>
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-between items-center gap-y-4">
          <div className="w-full flex justify-center">
            <p className="font-bold text-lg">Sign In</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col items-center w-full"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Username/Email</FormLabel>
                      <FormControl>
                        <Input placeholder="username/email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem  className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex p-2 border-[0.5px] border-solid border-black border-opacity-10 rounded-md focus-within:outline-2 focus-within:outline-solid focus-within:outline-black focus-within:rounded-md focus:border-opacity-100">
                          <input
                            placeholder="password"
                            className="focus-visible:outline-none focus-visible:border-none placeholder:text-muted-foreground placeholder:text-sm"
                            type={passwordType}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPassword(e.target.value);
                            }}
                          />
                          <PasswordCheckButton
                            passwordType={passwordType}
                            setPasswordType={setPasswordType}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Sign In</Button>
              </form>
            </Form>
          </div>

          <div className="w-full">
            <button
              onClick={() => {
                signIn("google");
              }}
              className="text-base text-neutral-500 bg-slate-200 w-full p-2 rounded-md hover:bg-black hover:text-white flex justify-center space-x-1 items-center"
            > 
                <div><GoogleIcon/></div>
                <div>Sign in with {"google"}</div>
               
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google size-5/6"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
    </svg>
  );
}

function PasswordCheckButton({
  passwordType,
  setPasswordType,
}: {
  passwordType: string;
  setPasswordType: any;
}) {
  function changePasswordType() {
    if (passwordType == "text") {
      setPasswordType("password");
    } else if (passwordType == "password") {
      setPasswordType("text");
    }
  }

  return (
    <button onClick={(e)=>{
      e.preventDefault();
      changePasswordType();
    }}>
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
