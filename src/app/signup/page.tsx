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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-pink-300 to-blue-500">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <Label htmlFor="username">username</Label>
            <Input placeholder="username" name="username" value={form.username} onChange={handleChange}  />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="email">email</Label>
            <Input  placeholder="email" name="email" value={form.email} onChange={handleChange}  />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input  type="password" placeholder="****************" name="password" value={form.password} onChange={handleChange}  />
          </div>
          <div className="mb-6">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input  type="password" placeholder="****************" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <Button type='submit' >Sign Up</Button>
          </div>
          <p className='mt-6 font-light '>alredy have an account  <span className='text-blue-800 font-semibold'><Link href='signin'>Sign In</Link></span> </p>
        </form>
        <Toaster />
      </div>
    </div>
  );
}
