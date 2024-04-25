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
} from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Loader from "@/ui/Loader";

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
const[createimpression]=useCreateimpressionMutation();
const[updatePost]=useUpdatePostMutation();
const[deltePost]=useDeleltePostMutation();
const[createview]=useCreateviewMutation();
const [commentText, setcommentText] = useState("");

const [formData, setFormData] = useState<FormState>({
    caption: "",
    media: null,
    dateTime: "", // Initialize dateTime property
  }); 

  

  

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
      <div className="container mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="mb-8"
        >
          <div className="mb-4">
            <Label htmlFor="caption">Caption</Label>
            <Input
              type="text"
              id="caption"
              value={formData.caption}
              onChange={handleCaptionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="media">Media</Label>
            <Input
              type="file"
              id="media"
              onChange={handleMediaChange}
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Date and time picker input */}
      <div className="mb-4">
        <label htmlFor="dateTime">Date and Time</label>
        <input
          type="datetime-local"
          id="dateTime"
          value={formData.dateTime}
          onChange={handleDateTimeChange}
          className="w-full p-2 border rounded"
        />
      </div>
          <Button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Post
          </Button>
        </form>
        <Toaster />
      </div>

      <div className="container mx-auto p-4">
    
        <h1 className="text-2xl font-bold text-center mb-6">Your Posts</h1>
        {isLoading && <Loader />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.posts
            .slice()
            .reverse()
            .map((post) => (
              <div
              key={post.id} id={`post-${post.id}`}
                className="bg-white shadow rounded-lg p-4"
              >
                <div>
                  <div>
                    
                  </div>
                </div>
                <div className="relative" >
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
      onCanPlay={() => createimpression(post.id)}
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
      <div className="rounded-full bg-white p-2 cursor-pointer">
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
    <PopoverContent>
      {/* Popover content */}
      <div className="p-2 space-x-3">
        <Dialog>
          <DialogTrigger>
            <Button >Update Post</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Content for updating the post */}
            {/* Add your form fields or content for updating the post here */}
            {/* For example: */}
            <div className="mb-4">
            <Label htmlFor="caption">Caption</Label>
            <Input
              type="text"
              id="caption"
              value={formData.caption}
              onChange={handleCaptionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="media">Media</Label>
            <Input
              type="file"
              id="media"
              onChange={handleMediaChange}
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              className="w-full p-2 border rounded"
            />
          </div>

            <DialogFooter>
              <Button onClick={() => handleUpdate(post.id)}>Update</Button>
             
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={() => handleDeletePost(post.id)}>Delete Post</Button>
      </div>
    </PopoverContent>
  </Popover>
  </div>
</div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                  <p className="text-gray-600">Tags: {post.tags}</p>
                </div>
                <div className="space-x-4">
                  <Button onClick={() => handleLike(post.id)}>
                    <Heart className="mr-2" />
                    {post.likes} like
                  </Button>
                  {/* <Button onClick={() => handleComment(post.id)}>
                    <MessageCircle className="mr-2" />
                    {post.comments} comments
                  </Button> */}
<Dialog >
  <DialogTrigger asChild>
    <Button variant="default" onClick={() => handleComment(post.id)}>
      {post.comments} <MessageCircle className="mr-2 ml-2" /> comments
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-4xl max-h-[500px] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Post Details</DialogTitle>
      <DialogDescription>Details of the selected post</DialogDescription>
    </DialogHeader>

    {/* Display details of the selected post */}
    <div className="bg-white shadow rounded-lg p-4">
      <img
        className="h-48 w-full object-contain rounded-t-lg"
        src={post.mediaUrl}
        alt="Post Media"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
        <p className="text-gray-600">Tags: {post.tags}</p>
      </div>
    </div>

    {/* Comment section */}
    <div className="mt-4">
      <Input
        type="text"
        name="commentText"
        value={commentText}
        onChange={(e) => setcommentText(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <Button
        onClick={() => handleSubmitComment(post.id)}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Post Comment
      </Button>
      <div className="mt-4">
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
        <Button type="button" variant="secondary">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>




<Popover >
  <PopoverTrigger asChild>
    <Button variant="default" onClick={() => handleShare(post.id)}>{post.shares} share</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="grid gap-4 p-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none" >Share</h4>
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
    </>
  );


}
