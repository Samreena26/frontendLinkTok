'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useGetUserDetailQuery, useUpdatedetailsMutation,useGetAllLikesQuery,
  useGetallcommentsQuery,
  useGetallsharesQuery,
  useGetallimpressionsQuery,
  useGetallviewsQuery,} from "@/lib/linkTokApi";
import { Button } from "@/ui/button";
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
import Loader from "@/ui/Loader";

interface updatedetailsResponse {
  message: string;
}

interface FormState {
  bio: string;
  media: File | null;
}

export default function page() {
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
    <div className="bg-gray-100 min-h-screen">
      {data && (
        <div className="flex flex-col items-center pt-8">
          <img className="h-24 w-24 rounded-full" src={data.profilePictureURL} alt="Profile" />
          <h1 className="mt-4 text-3xl font-bold">{data.username}</h1>
          <p className="text-sm text-gray-600">{data.userBio || 'bio not available'}</p>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input type="text" id="bio" value={formData.bio} onChange={handleBioChange} className="w-60 p-2 border rounded" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="media" className="text-right">
                  Profile Picture
                </Label>
                <Input type="file" id="media" onChange={handleMediaChange} accept="image/jpeg,image/png" className="w-60 p-2 border rounded" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
        {/* Replace with actual data */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Likes</h2>
          <p className="text-3xl">{allLikes?.totalLikes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Comments</h2>
          <p className="text-3xl">{allComments?.totalComments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Shares</h2>
          <p className="text-3xl">{allShares?.totalShares}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">impressions</h2>
          <p className="text-3xl">{allImpressions?.totalImpressions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">impressions</h2>
          <p className="text-3xl">{allViews?.totalViews}</p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
