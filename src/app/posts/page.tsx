"use client";
import { useState } from "react";

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
  useViewfollowingpostQuery,
  useLikepostMutation,
  useCreatecommentMutation,
  useViewcommentsQuery,
  useCreateimpressionMutation,
  useCreateviewMutation,
  
} from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";


import { Heart, MessageCircle, Share2 } from "lucide-react";

import Loader from "@/ui/Loader";

export default function page() {
  const { toast } = useToast();
  const [isSectionVisible, setSectionVisible] = useState<{
    [postId: number]: boolean;
  }>({});
  const [commentText, setcommentText] = useState("");

  const [createcomment] = useCreatecommentMutation();
  const[createview]=useCreateviewMutation();
  const [post_id, setpost_id] = useState<number>(0); // State to store the post_id

  const { data: commentsData, refetch: commentsFetch } = useViewcommentsQuery(
    post_id || 0
  );
  const { data,isError,isLoading } = useViewfollowingpostQuery();
  console.log(data);
  const[createimpression]=useCreateimpressionMutation();





  if(isError)return <div>you are not follwoing anyone</div>;
  console.log(data);

  const [likepost] = useLikepostMutation();

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


  return (
    <>
      <div className="w-screen h-screen ">
      {isLoading && <Loader />}
        {data?.followingPost.map((post: any) => (
          <div key={post.post_id}>
            <div className="flex  space-x-4 p-4">
              <img
                src={post.profilePictureUrl}
                alt={`${post.username}'s Profile`}
                className="h-16 w-16 rounded-full"
              />
              <h3 className="text-xl font-bold">{post.username}</h3>
            </div>
            <div>
            {post.postType === 'photo' ? (
      // Display image if it's a photo
      <img
        className="h-48 w-full object-contain rounded-t-lg"
        onMouseEnter={()=>{createimpression(post.post_id)}}
        src={post.mediaURL}
        alt="Post Media"
      />
    ) : (
      // Display video if it's a video
      <video
        className="h-48 w-full object-contain rounded-t-lg"
        onCanPlay={()=>{createimpression(post.post_id)}}
        onPlay={() => createview(post.id)}
        controls
        muted
        loop
      >
        <source src={post.mediaURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )}
            </div>
            <div className="space-x-4">
              <Button onClick={() => handleLike(post.post_id)}>
                <Heart className="mr-2" />
                {post.like_count}
                like
              </Button>
              {/* <Button onClick={() => handleComment(post.post_id)}>
                <MessageCircle className="mr-2" />
                {post.comment_count}
                comment
              </Button> */}



<Dialog >
  <DialogTrigger asChild>
    <Button variant="default" onClick={() => handleComment(post.post_id)}>
      {post.comments}  <MessageCircle className="mr-2 ml-2" /> comments
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
        src={post.mediaURL}
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
        onClick={() => handleSubmitComment(post.post_id)}
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
























              <Button>
                <Share2 className="mr-2" />
                share
              </Button>
            </div>
            {isSectionVisible[post.post_id] && (
              <div>
                {/* Your section content goes here */}
                <p>This is the section content</p>
                <Input
                  type="text"
                  name="commentText"
                  value={commentText}
                  onChange={(e) => setcommentText(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <Button onClick={() => handleSubmitComment(post.post_id)}>
                  <MessageCircle className="mr-2" />
                  post comment
                </Button>
              </div>
            )}
          </div>
        ))}
        <Toaster />
      </div>
    </>
  );
}
