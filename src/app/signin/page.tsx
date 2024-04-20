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
<div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-pink-300 to-blue-500">
  <div className="w-full max-w-xs">
    <form  onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
            <Label htmlFor="email">email</Label>
            <Input  placeholder="email" name='email' value={formData.email} onChange={handleChange}/>
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input  type="password" placeholder="****************" name='password' value={formData.password} onChange={handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <Button type='submit'>Sign in</Button>
          </div>
      <p className='mt-6 font-light '>don't have an account  <span className='text-blue-800 font-semibold'><Link href='signup'>Sign UP</Link></span> </p>

    </form>
    <Toaster />

  </div>
</div>

    </>
  );
}
