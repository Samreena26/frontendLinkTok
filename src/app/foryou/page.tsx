'use client'
import React, { useEffect, useRef, useState} from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetForYouVideosQuery, useLikepostMutation,useCreateimpressionMutation,useCreateviewMutation } from '@/lib/linkTokApi';
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";

import { Heart } from "lucide-react";
import Loader from '@/ui/Loader';
import Navbar from '@/components/ui/Navbar';

export default function Page() {
  const { data, error, isLoading } = useGetForYouVideosQuery();
  console.log(data);
  const [likePost] = useLikepostMutation();
  const[createimpression]=useCreateimpressionMutation();
  const[createview]=useCreateviewMutation();

  
  const { toast } = useToast();

  // Use the useInView hook to monitor each video element
 
  const handleLike = async (postId: number) => {
    try {
      const response = await likePost({ post_id: postId }).unwrap();
      toast({
        title: 'Success',
        description: response.message,
      });
    } catch (err:any) {
      toast({
        title: 'Error',
        description: err.data?.error || 'Error liking the post',
        variant: 'destructive',
      });
    }
  };

  
  if (isLoading) return <Loader/>;
  if (error) return <div>Error occurred</div>;


  




  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
    </div>
    <div className='bg-gray-300 h-min grid grid-cols-8'>
      <Navbar/>
      <Toaster />
      <div className='h-min min-w-max mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 '>
      {data?.posts.map((post, index) => (
        <div key={post.id} className="flex justify-center items-center my-4 ">
          <div className="relative">
            <div className='bg-gray-500 '>
          <video
            src={post.mediaUrl}
            onMouseEnter={() => createimpression(post.id)}
            onPlay={() => createview(post.id)}
            className="w-96 mx-auto h-96"
            controls
            muted
            loop
          />
          </div>
            <button
              onClick={() => handleLike(post.id)}
              className="absolute right-2 top-2 text-red-500"
            >
              <Heart size={30} fill='red' />
            </button>
          </div>
        </div>
      ))}
      </div>
      </div>
    </>
  );




  // src={post.mediaUrl}
}
