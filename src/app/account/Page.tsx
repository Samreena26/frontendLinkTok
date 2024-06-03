'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useGetUserDetailQuery, useUpdatedetailsMutation,useGetAllLikesQuery,
  useGetallcommentsQuery,
  useGetallsharesQuery,
  useGetallimpressionsQuery,
  useGetallviewsQuery,
  useSignoutUserMutation} from "@/lib/linkTokApi";
  import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { useRouter } from 'next/navigation';
import Loader from "@/ui/Loader";
import Navbar from "@/components/ui/Navbar";

interface updatedetailsResponse {
  message: string;
}

interface FormState {
  bio: string;
  media: File | null;
}

export default function page() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isError, isLoading, refetch } = useGetUserDetailQuery();
  const [updatedetails, { isSuccess }] = useUpdatedetailsMutation();

  const [formData, setFormData] = useState<FormState>({ bio: '', media: null });

  const handleBioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, media: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    const apiFormData = new FormData();
    apiFormData.append('bio', formData.bio);
    formData.media && apiFormData.append('media', formData.media);

    try {
      const response: updatedetailsResponse = await updatedetails(apiFormData).unwrap();
      toast({
        title: 'Success',
        description: response.message,
      });
    } catch (err: any) {
      const errorMessages = err.data?.errors ? Object.values(err.data.errors).flat().join('\n') : 'An unexpected error occurred.';
      toast({
        title: 'Error',
        description: errorMessages,
        variant: 'destructive'
      });
    }
  };

  

  const {data:allLikes ,refetch:refetchlikes}=useGetAllLikesQuery();
  const {data:allComments,refetch:refetchComments}=useGetallcommentsQuery();
const {data:allShares,refetch:refetchShares}=useGetallsharesQuery();
const {data:allImpressions,refetch:refetchImpressions}=useGetallimpressionsQuery();
const {data:allViews,refetch:refetchViews}=useGetallviewsQuery();
const [signoutUser]=useSignoutUserMutation();
const handlesignout=async ()=>{
 
  try{
    const response= await signoutUser().unwrap();
    toast({
      title: 'Success',
      description: response.message,
    });
    localStorage.removeItem('token');
    router.push('/');
  }catch(err:any){
    const errorMessages = err.data?.errors ? Object.values(err.data.errors).flat().join('\n') : 'An unexpected error occurred.';
    toast({
      title: 'Error',
      description: errorMessages,
      variant: 'destructive'
    });
  }
}

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
    refetchlikes();
    refetchComments();
    refetchShares();
    refetchImpressions();
refetchViews();
  }, [isSuccess, refetch]);

  if (isLoading) return <Loader/>;
  if (isError) return <div>Error occurred</div>;

  return (
  <>
  <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
  </div>
    <div className="bg-gray-300 h-min grid grid-cols-7">
      <Navbar/>
      
      {/* div contain two more divs */}
      <div className="grid h-min min-w-max grid-cols-2">
      {/* 1st div contain profile pic, name, bio and edit profile  */}
     <div className="w-44 mt-32 ml-32">
      {data && (
        <div className="flex flex-col items-center mt-32 w-44">
          <img className="h-24 w-24 rounded-full" src={data.profilePictureURL} alt="Profile" />
          <h1 className="mt-4 text-3xl font-bold">{data.username}</h1>
          <p className="text-sm text-gray-600">{data.userBio || 'bio not available'}</p>
        </div>
      )}

<Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center mt-4">
          <Button variant="outline" className="bg-gray-400 hover:bg-gray 500">Edit Profile</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-gray-300 border-gray-300">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className="text-black">
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input type="text" id="bio" placeholder="Edit Bio...." value={formData.bio} onChange={handleBioChange} className="w-60 p-2 border rounded placeholder:text-black" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="media" className="text-right">
                  Profile Picture
                </Label>
                <Input type="file" id="media" onChange={handleMediaChange} accept="image/jpeg,image/png" className="w-60 p-2 border rounded" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gray-800">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>

      {/* Analytics Section */}
      {/* 2nd div contain logout button and analytics section */}
      <div className="-ml-32 mt-4">
      <div className="flex justify-end p-4">
    <Button   className="bg-gray-800 hover:bg-gray-500 text-white font-bold py-5 px-4 rounded-lg" 
    onClick={handlesignout}>
      Log Out
    </Button>
  </div>
      <div className="h-8 w-44 mt-8 mb-16">
      <h1 className="text-center pl-64 text-3xl text-black font-bold">Analytics</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-min">
        {/* Replace with actual data */}
        <div className="bg-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Likes</h2>
          <p className="text-3xl">{allLikes?.totalLikes}</p>
        </div>
        <div className="bg-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Comments</h2>
          <p className="text-3xl">{allComments?.totalComments}</p>
        </div>
        <div className="bg-gray-400 p-4 rounded-lg shadow w-80">
          <h2 className="text-lg font-semibold">Shares</h2>
          <p className="text-3xl">{allShares?.totalShares}</p>
        </div>
        <div className="bg-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">impressions</h2>
          <p className="text-3xl">{allImpressions?.totalImpressions}</p>
        </div>
        <div className="bg-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Views</h2>
          <p className="text-3xl">{allViews?.totalViews}</p>
        </div>
        </div>
      </div>
      </div>
      <Toaster />
    </div>
    </>
  );
}
