"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect,useRef } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"

import {
  useCreatePostMutation,
  useGetuserpostsQuery,
  useLikepostMutation,
  useCreatecommentMutation,
  useViewcommentsQuery,
  useCreateimpressionMutation,
  useShareMutation,
  useUpdatePostMutation,
  useDeleltePostMutation,
  useCreateviewMutation,
  useCreateReportMutation
} from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { CommandIcon, Heart, MessageCircle, Share2, ShareIcon } from "lucide-react";
import Loader from "@/ui/Loader";
import Navbar from "@/components/ui/Navbar";

interface CreatePostResponse {
  message: string;
}

interface FormState {
  caption: string;
  media: File | null;
  dateTime: string; // Add dateTime property
}



export default function Page() {
  const { toast } = useToast();

  const [post_id, setpost_id] = useState<number>(0); // State to store the post_id


  const [createPost, { isSuccess }] = useCreatePostMutation();
  const { data, isLoading, refetch } = useGetuserpostsQuery();
  console.log(data); 
  const { data: commentsData, refetch: commentsFetch } = useViewcommentsQuery(
    post_id || 0
  );
  const [sharePost, { isLoading: isSharing }] = useShareMutation();


  const [likepost] = useLikepostMutation();
  const [createcomment] = useCreatecommentMutation();
  const [createReport] =useCreateReportMutation();
const[updatePost]=useUpdatePostMutation();
const[deltePost]=useDeleltePostMutation();
const[createview]=useCreateviewMutation();
const[createimpression]=useCreateimpressionMutation();
const [commentText, setcommentText] = useState("");

const [formData, setFormData] = useState<FormState>({
    caption: "",
    media: null,
    dateTime: "", // Initialize dateTime property
  }); 

  const [reason, setreason] = useState(""); 


  const handlereasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    setreason(e.target.value);
  };
  
  const handlereport = async (post_id: number, reason: string,user_id:number) => {
    try {
     
      const response = await createReport({ post_id, reason,user_id }).unwrap();
      console.log(response);
      toast({
        title: "Success",
        description: "Report created successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  


  const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, caption: e.target.value });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, media: e.target.files[0] });
    }
  };

   // Function to handle changes in the date and time picker
   const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      dateTime: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.media) {
      toast({
        title: "Error",
        description: "Media file is required",
        variant: "destructive",
      });
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("caption", formData.caption);
    formData.media && apiFormData.append("media", formData.media);
    apiFormData.append("dateTime", formData.dateTime);

    try {
      const response: CreatePostResponse = await createPost(
        apiFormData
      ).unwrap();
      toast({
        title: "Success",
        description: response.message,
      });
    } catch (err: any) {
      const errorMessages = err.data?.errors
        ? Object.values(err.data.errors).flat().join("\n")
        : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessages,
        variant: "destructive",
      });
    }
  };



  const handleDeletePost = async (id:number)=>{
   await deltePost({post_id:id});
   setTimeout(() => {
    refetch();
   }, 3000);
   
  }

  const handleUpdate = async (post_id: number) => {
    const apiFormData = new FormData();
  
    // Append caption if available
    if (formData.caption) {
      apiFormData.append("caption", formData.caption);
    }
  
    // Append media if available
    if (formData.media) {
      apiFormData.append("media", formData.media);
    }
  
    try {
      const response = await updatePost({ post_id, formData: apiFormData }).unwrap();
      console.log(response);
      toast({
        title: "Success",
        description: "Post updated",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  
    setTimeout(() => {
      refetch();
    }, 3000);
  }
  
  

  const handleLike = async (id: number) => {
    try {
      // Trigger the likepost mutation and unwrap the result to handle errors
      const response = await likepost({ post_id: id }).unwrap();
      console.log(response);
      // Display a success toast with the response message
      toast({
        title: "Success",
        description: response.message, // Ensure the server sends a 'message' field in the JSON response
      });
    } catch (err: any) {
      // Extract error messages from the server response and display them in a toast
      const errorMessages = err.data?.error
        ? err.data.error
        : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessages,
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async (postId: number) => {
    try {
      // Trigger the createcomment mutation and unwrap the result to handle errors
      const response = await createcomment({
        post_id: postId,
        commentText,
      }).unwrap();

      // Display a success toast with the response message
      toast({
        title: "Success",
        description: response.message, // Ensure the server sends a 'message' field in the JSON response
      });

      // Clear the input field after successful submission
      setcommentText("");
      commentsFetch(); // Refetch comments after successful submission

    } catch (err: any) {
      // Extract error messages from the server response and display them in a toast
      const errorMessages = err.data?.error
        ? err.data.error
        : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessages,
        variant: "destructive",
      });
    }
  };

  const handleComment = (postId: number) => {
    // Update visibility based on current state
    



    setpost_id(postId); // Update current post ID

    // Open and potentially refetch comments for the new post
    

    if (postId !== 0) {
      commentsFetch();
    }
  };



  const handleShare = async ( post_id:number) => {
    try {
      const shareData = await sharePost(post_id).unwrap();
console.log(shareData);
      // Handle successful share
    } catch (error) {
      // Handle error
    }
  };
  
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  
 
  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
    </div>
       <div className="bg-gray-300 grid grid-cols-6 h-min">
        <Navbar/>
        <div className="h-min min-w-max mt-2 mb-6">
        <form
          onSubmit={handleSubmit}
          className="mb-5 mt-8 grid grid-cols-2"
        >
          <div>
          <div className="grid max-w-60 items-center gap-3 mx-auto mt-2">
            <Label htmlFor="caption" className=" text-2xl font-bold mt-4 text-center">Create Post</Label>
            <Input
              type="text"
              id="caption"
              placeholder="Add caption and #tags...."
              value={formData.caption}
              onChange={handleCaptionChange}
              className="p-2 border-stone-950 rounded-lg placeholder:text-black placeholder:text-center bg-gray-500"
            />
          </div>
          <div className="mb-4 w-60 mx-auto mt-3 flex">
            <Input
              type="file"
              id="media"
              onChange={handleMediaChange}
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              className=" p-2 border-stone-950 rounded-lg pl-7 bg-gray-500"
            />
          </div>
          <div className="w-28 mx-auto mt-2 rounded-lg">
          <Button
            type="submit"
            className="bg-gray-800 text-white rounded-lg hover:bg-sky-700 w-28"
          >
            Upload Post
          </Button>
          </div>
          </div>
          <div>
          {/* Date and time picker input */}
      <div className="grid max-w-60 items-center gap-3 mx-auto mt-4">
        <label htmlFor="dateTime" className="text-2xl font-bold mt-4 text-center">Schedule Post</label>
        <input
          type="datetime-local"
          id="dateTime"
          value={formData.dateTime}
          onChange={handleDateTimeChange}
          className=" p-2 border-stone-950 rounded-lg bg-gray-500 pl-7"
        />
      </div>
          <div className="w-28 mx-auto mt-2 rounded-lg">
          <Button
            type="submit"
            className="bg-gray-800 text-white rounded-lg mt-2 hover:bg-sky-700"
          >
            Schedule Post
          </Button>
          </div>
          </div>
        </form>
        <Toaster/>

        <h1 className="text-2xl font-bold text-center mb-6 pt-7">Your Posts</h1>
        {isLoading && <Loader />}
        <div className="grid grid-cols-3 gap-6">
          {data?.posts
            .slice()
            .reverse()
            .map((post) => (
              <div
                key={post.id}
                className="bg-gray-500 shadow rounded-lg p-2"
              >
                <div className="relative" >
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                  <p className="text-gray-900">Tags: # {post.tags}</p>
                </div>
  {post.postType === 'photo' ? (
    // Display image if it's a photo
    <img
      className="h-48 w-full object-contain rounded-t-lg"
      onMouseEnter={() => createimpression(post.id)}
      src={post.mediaUrl}
      alt="Post Media"
    />
  ) : (
    // Display video if it's a video
    <video
      className="h-48 w-full object-contain rounded-t-lg"
      onMouseEnter={() => createimpression(post.id)}
      onPlay={() => createview(post.id)}
      controls
      muted
      loop
    >
      <source src={post.mediaUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )}

  {/* Three vertical dots in a round white div */}
  <div className="absolute top-0 right-0 mt-2 ml-2">
  <Popover>
    <PopoverTrigger>
      <div className="rounded-full bg-gray-800 p-2 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 8a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </PopoverTrigger>
    <PopoverContent className="bg-sky-800">
      {/* Popover content */}
      <div className="p-2 space-x-3 bg-sky-600">
        <Dialog>
          <DialogTrigger>
            <Button className="ml-3">Update Post</Button>
          </DialogTrigger>
          <DialogContent className="bg-sky-200">
            {/* Content for updating the post */}
            {/* Add your form fields or content for updating the post here */}
            {/* For example: */}
            <div className="mt-5 w-64 mx-auto">
            <Input
              type="text"
              id="caption"
              value={formData.caption}
              onChange={handleCaptionChange}
              placeholder="Add captions and #Tags..."
              className="w-full border-stone-950 rounded-lg bg-sky-500 placeholder:text-gray-800 pl-9"
            />
          </div>
          <div className="mt-3 w-64 mx-auto">
            <Input
              type="file"
              id="media"
              onChange={handleMediaChange}
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              className="w-full pl-7 border-stone-950 rounded-lg bg-sky-500"
            />
          </div>

            <DialogFooter>
              <Button onClick={() => handleUpdate(post.id)}>Update post</Button>
             
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <Button >Report Post</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Content for updating the post */}
            {/* Add your form fields or content for updating the post here */}
            {/* For example: */}
            <div className="mb-4">
            <Label htmlFor="reason">reason</Label>
            <Input
              type="text"
              id="reason"
              value={reason}
              onChange={handlereasonChange}
              className="w-full p-2 border rounded"
            />
          </div>
          

            <DialogFooter>
              <Button onClick={() => handlereport(post.id,reason,post.userId)}>Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={() => handleDeletePost(post.id)} className="mt-4">Delete Post</Button>
      </div>
    </PopoverContent>
  </Popover>
  </div>
</div>
                <div className="space-x-4 flex mt-4">
                  <Button onClick={() => handleLike(post.id)} className="bg-gray-900">
                    <Heart className="mr-1 size-4 fill-red-600"/>
                    {post.likes} like
                  </Button>
                  {/* <Button onClick={() => handleComment(post.id)}>
                    <MessageCircle className="mr-2" />
                    {post.comments} comments
                  </Button> */}
<Dialog >
  <DialogTrigger asChild>
    <Button  onClick={() => handleComment(post.id)} className="bg-gray-900 text-white">
      <MessageCircle className="mr-1 size-4" fill="white"/>
      {post.comments} comments
    </Button>
  </DialogTrigger>

              <DialogContent className="sm:max-w-4xl max-h-[500px] overflow-y-auto bg-gray-300">
                <DialogHeader>
                  <DialogTitle>Post Details</DialogTitle>
                  <DialogDescription className="text-gray-600">Details of the selected post</DialogDescription>
                </DialogHeader>

                {/* Display details of the selected post */}
                <div className="bg-gray-400 shadow rounded-lg p-4">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                    <p className="text-gray-600">Tags: # {post.tags}</p>
                  </div>
                  <img
                    className="h-48 w-full object-contain rounded-t-lg"
                    src={post.mediaUrl}
                    alt="Post Media"
                  />
                </div>

                {/* Comment section */}
                <div className="mt-4">
                  <Input
                    type="text"
                    name="commentText"
                    value={commentText}
                    onChange={(e) => setcommentText(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                  />
                  <Button
                    onClick={() => handleSubmitComment(post.id)}
                    className="mt-4 bg-gray-900 text-white py-2 px-4 rounded hover:bg-orange-900"
                  >
                    Post Comment
                  </Button>
                  <div className="mt-6">
                    {/* Display comments for the selected post */}
                    {commentsData?.commentsData.map((comment) => (
                      <div key={comment.id} className="flex items-center mt-2">
                        <img
                          className="h-10 w-10 object-cover rounded-full"
                          src={comment.profilePictureUrl}
                          alt="profile"
                        />
                        <div className="ml-2">
                          <h4 className="font-bold">{comment.username}</h4>
                          <p>{comment.commentText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" className="bg-gray-900 hover:bg-orange-900">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Popover >
              <PopoverTrigger asChild>
                <Button onClick={() => handleShare(post.id)} className="bg-gray-900  min-w-max">
                  <Share2 className="mr-1 size-4" fill="white"/>
                  {post.shares} share</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-sky-500">
                <div className="grid gap-4 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Share</h4>
                    <input
                      type="text"
                      readOnly
                      value={`http://localhost:3000/getpost?post_id=${post.id}`} // Replace `post.id` with the actual post ID variable
                      className="w-full text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

                </div>
              </div>
            ))}
        </div>
      </div>
      </div>
    </>
  );
}
