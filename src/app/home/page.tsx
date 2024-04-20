"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
  useCreatePostMutation,
  useGetuserpostsQuery,
  useLikepostMutation,
  useCreatecommentMutation,
  useViewcommentsQuery,
} from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface CreatePostResponse {
  message: string;
}

interface FormState {
  caption: string;
  media: File | null;
}



export default function Page() {
  const { toast } = useToast();

  const [post_id, setpost_id] = useState<number>(0); // State to store the post_id


  const [createPost, { isSuccess }] = useCreatePostMutation();
  const { data, isError, isLoading, refetch } = useGetuserpostsQuery();
  const { data: commentsData, refetch: commentsFetch } = useViewcommentsQuery(
    post_id || 0
  );

  const [likepost] = useLikepostMutation();
  const [createcomment] = useCreatecommentMutation();





 

  const [commentText, setcommentText] = useState("");

  const [formData, setFormData] = useState<FormState>({
    caption: "",
    media: null,
  });

  const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, caption: e.target.value });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, media: e.target.files[0] });
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.posts
            .slice()
            .reverse()
            .map((post) => (
              <div
                key={post.id}
                className="bg-white shadow rounded-lg p-4"
              >
                <img
                  className="h-48 w-full object-contain rounded-t-lg"
                  src={post.mediaUrl}
                  alt="Post Media"
                />

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
    <Button variant="outline" onClick={() => handleComment(post.id)}>
      {post.comments} comments
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




                  <Button>
                    <Share2 className="mr-2" />
                    share
                  </Button>
                </div>




                




                 
             
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
