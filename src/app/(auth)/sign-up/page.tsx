'use client'
import React,{useState,useEffect,useCallback} from 'react'
import {z} from 'zod'
import { signUpSchema } from '@/schemas/sign_up_schema'
import {useForm} from 'react-hook-form'
import { sign } from 'crypto'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios,{AxiosError} from 'axios'
import {LassoSelect, Loader2} from 'lucide-react'

import{ useDebounce} from '@uidotdev/usehooks'
import Link from 'next/link'
import {useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/api_response'

const SignUpPage = () => {
  const [username,setUsername] = useState('');
  const [isCheckingUsername,setIsCheckingUSername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounce(username,1000);
  const router = useRouter();
  const {toast} = useToast();
  


  


  const [checkUniqueUsernameResponse,setCheckUniqueUsernameResponse] = useState<({
    Success:boolean,
    Message?:string,
    Error?:string
  }|null)>(null);

  useEffect(()=>{
    
    const checkUsernameUnique = async()=>{
      try{
        setIsCheckingUSername(true);
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`) as ({
          data:{
          Success:boolean,
          Message?:string,
          Error?:string
        }})

        setCheckUniqueUsernameResponse(response.data);
        console.log(response.data);

      }
      catch(err){
        const error = err as AxiosError
       console.log(error.response?.data);
       if(error.response == undefined){
        setCheckUniqueUsernameResponse(null)
        return;
       }
       const errorResponse = error.response.data as ({
        Success:boolean,
        Message?:string,
        Error?:string
      }|null)
       setCheckUniqueUsernameResponse(errorResponse)
      }
      finally{
        setIsCheckingUSername(false);
      }
      
    }
    if(debouncedUsername != ""){
      checkUsernameUnique();
    }
  },[debouncedUsername])



  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })


  async function onSubmit(values:z.infer<typeof signUpSchema>){
    setIsSubmitting(true);
    try{
      const response = await axios.post('/api/sign-up',{
        username:values.username,
        email:values.email,
        password:values.password
      })
      
        toast({
          title:response.data.Message
        })
      
      
      
    }
    catch(err){
      console.log(err);
      const error = err as AxiosError<ApiResponse>;
      toast({
        title:error.response?.data?.Message
      })
      
    }
    finally{
      setIsSubmitting(false);
      router.replace(`/verify/${values.username}`)
    }


    console.log(values);
  }


  return (
    <div className='min-h-screen bg-slate-600 flex justify-center'>
      <div className='w-full bg-white p-4 flex justify-center items-center'>
        <div>
          <div className='max-w-fit max-h-fit p-2'>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({field})=>(
                  <FormItem>
                    <FormLabel className='font-bold'>Username</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="username" 
                        {...field}
                        onChange={(e)=>{
                        field.onChange(e)
                        setUsername(e.target.value);
                      }}/>
                    </FormControl>

                    {isCheckingUsername && <Loader2 className='animate-spin'></Loader2>}
                    <FormDescription
                      className={`${ checkUniqueUsernameResponse != null &&checkUniqueUsernameResponse.Success == true ? 'text-green-500':'text-red-500'}`}
                    >
                      {
                        isCheckingUsername==false && checkUniqueUsernameResponse != null && checkUniqueUsernameResponse.Message 
                      }
                    </FormDescription>
                    <FormMessage 
                      
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({field})=>(
                  <FormItem>
                    <FormLabel className='font-bold'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
              
                control={form.control}
                name="password"
                render={({field})=>(
                  <FormItem>
                    <FormLabel
                    className='font-bold'>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button type="submit" >
                {
                  isSubmitting == false ? 'Sign Up' : <Loader2 className='animate-spin'></Loader2>
                }
              </Button>
            </form>
          </Form>
          </div>
          <div className='text-sm text-slate-500 max-w-fit max-h-fit p-2'>
            <p className='text-sm text-slate-500'>
              Already a Member?Please <Link href='/sign-in' className='underline hover:text-blue-400'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage


//when i write i username i send request to check-username-unique for availability of username

