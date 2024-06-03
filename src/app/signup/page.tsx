'use client'
// Import Shadecn components
import {Input} from '@/ui/input';
import { Button} from '@/ui/button';
import { Label} from '@/ui/label';
import { Toaster } from "@/ui/toaster"
import { useToast } from "@/ui/use-toast"


import Link from 'next/link';
import { useState,FormEvent,ChangeEvent } from 'react';
import {useSignupUserMutation} from '@/lib/linkTokApi';
import { useRouter } from 'next/navigation'; // Corrected import

export default function page() {

  const { toast } = useToast()
  const [signupUser] = useSignupUserMutation();
  const router = useRouter();

type FormState={
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}


const [form,setForm]=useState<FormState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
const {name,value}=e.target;
setForm(prevForm=>({...prevForm,[name]:value}))
};


interface singupResponse{
  message:string;
  redirect:string;
}

const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
try{
const userDetails={
  username:form.username,
  email:form.email,
  password:form.password,
  password_confirmation:form.confirmPassword,
}

const response:singupResponse=await signupUser(userDetails).unwrap();
toast({
 title:'success',description:response.message,
})

setTimeout(() => {
  router.push(response.redirect);
}, 3000);

  
}catch (err: any) {
  // Check if the error structure matches the expected format
  if (err && 'data' in err && err.data.errors) {
    const errors = err.data.errors as Record<string, string[]>;
    const errorMessages = Object.values(errors).flat().join('\n');
    toast({
      title: 'Error',
      description: errorMessages,
      variant: 'destructive'
    });
  } else {
    // Fallback for any other type of error
    toast({
      title: 'Error',
      description: 'An unexpected error occurred.',
      variant: 'destructive'
    });
  }



}

}

  return (
    <div className="flex  bg-[url('/signup.png')] bg-cover h-screen  w-screen">
      <div className="w-full max-w-xs mt-20 ml-72">
        <form onSubmit={handleSubmit} className="bg-gray-600 text-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <Label htmlFor="username">username</Label>
            <Input placeholder="username" name="username" className='mt-2 text-black bg-gray-300' value={form.username} onChange={handleChange}  />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input  placeholder="example@gmail.com" name="email" className='mt-2 text-black bg-gray-300' value={form.email} onChange={handleChange}  />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input  type="password" placeholder="****************" name="password" className='mt-2 text-black bg-gray-300' value={form.password} onChange={handleChange}  />
          </div>
          <div className="mb-6">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input  type="password" placeholder="****************" name="confirmPassword"  className='mt-2 text-black bg-gray-300' value={form.confirmPassword} onChange={handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <Button type='submit' >Sign Up</Button>
          </div>
          <p className='mt-6 font-light '>Already have an account  <span className='text-gray-900 font-bold'><Link href='signin'>Sign In</Link></span> </p>
        </form>
        <Toaster />
      </div>
    </div>
  );
}
