'use client'
// Import Shadecn components
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import Link from 'next/link';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useSigninUserMutation } from '@/lib/linkTokApi';
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { useRouter } from 'next/navigation'; // Corrected import

export default function page() {
  const { toast } = useToast();
  const router = useRouter();

  const [signinUser] = useSigninUserMutation();
  type FormState = {
    email: string;
    password: string;
  };

  const [formData, setformData] = useState<FormState>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  type SigninResponse = {
    message: string;
    redirect: string;
    token:string;
  };
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response: SigninResponse = await signinUser(formData).unwrap();
      console.log(response);
       // Store the token in local storage
       localStorage.setItem('token', response.token);
      toast({
        title: 'Success',
        description: response.message,
      });

      setTimeout(() => {
        router.push(response.redirect);
      }, 3000);

    } catch (err: any) {
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
  };

  return (
    <>
<div className="flex items-center justify-center bg-[url('/signin.png')] bg-cover h-screen  w-screen ">
  <div className="w-full max-w-xs ml-96 h-min">
    <form  onSubmit={handleSubmit} className="bg-gray-600 text-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
    <div className="mb-4 mt-6">
            <Label htmlFor="email">Email</Label>
            <Input  placeholder="example@gmail.com" name='email' className='mt-2 text-black bg-gray-300' value={formData.email} onChange={handleChange}/>
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input  type="password" placeholder="****************" name='password' className='mt-2 bg-gray-300 text-black' value={formData.password} onChange={handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <Button type='submit'>Sign in</Button>
          </div>
      <p className='mt-6 font-light '>Don't have an account  <span className='text-gray-900 font-bold'><Link href='signup'>Sign UP</Link></span> </p>

    </form>
    <Toaster />

  </div>
</div>

    </>
  );
}
