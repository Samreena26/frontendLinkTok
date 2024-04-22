'use client'
import React, { useEffect, useRef, useState} from 'react';
import { useGetForYouVideosQuery, useLikepostMutation,useCreateimpressionMutation } from '@/lib/linkTokApi';
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";

import { Heart } from "lucide-react";
import Loader from '@/ui/Loader';

export default function Page() {
  const { data, error, isLoading } = useGetForYouVideosQuery();
  console.log(data);
  const [likePost] = useLikepostMutation();
  const[createimpression]=useCreateimpressionMutation();
  const { toast } = useToast();
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = videoRefs.current.indexOf(entry.target as HTMLVideoElement);
          if (entry.isIntersecting) {
            setActiveVideo(index);
          }
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((video) => observer.observe(video));

    return () => {
      videoRefs.current.forEach((video) => observer.unobserve(video));
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === activeVideo) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, [activeVideo]);

  if (isLoading) return <Loader/>;
  if (error) return <div>Error occurred</div>;

  return (
    <>
      <Toaster />
      {data?.posts.map((post, index) => (
        <div key={post.id} className="flex justify-center items-center my-4">
          <div className="relative">
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            src={post.mediaUrl}
            className="w-full md:w-52 lg:w-72 mx-auto"
            controls
            muted
            loop
          />
            <button
              onClick={() => handleLike(post.id)}
              className="absolute right-2 top-2 text-red-500"
            >
              <Heart size={24} />
            </button>
          </div>
        </div>
      ))}
    </>
  );




  // src={post.mediaUrl}
}
