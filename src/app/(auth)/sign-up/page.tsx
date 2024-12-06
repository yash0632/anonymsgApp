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
import {Loader2} from 'lucide-react'

import{ useDebounce} from '@uidotdev/usehooks'

const SignUpPage = () => {
  const [username,setUsername] = useState('');
  const [isCheckingUsername,setIsCheckingUSername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounce(username,1000);
  


  


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


  function onSubmit(values:z.infer<typeof signUpSchema>){
    try{

    }
    catch(err){
      
    }


    console.log(values);
  }


  return (
    <div className='min-h-screen bg-slate-600 flex justify-center'>
      <div className='w-full bg-white p-4 flex justify-center items-center'>
        <div className='max-w-fit max-h-fit p-4'>
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
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage


//when i write i username i send request to check-username-unique for availability of username

