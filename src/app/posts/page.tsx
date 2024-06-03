"use client";
import { useState ,ChangeEvent} from "react";

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
  useViewfollowingpostQuery,
  useLikepostMutation,
  useCreatecommentMutation,
  useViewcommentsQuery,
  useCreateimpressionMutation,
  useCreateviewMutation,
  useCreateReportMutation,
  useShareMutation,
} from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

import { Heart, MessageCircle, Share2 } from "lucide-react";

import Loader from "@/ui/Loader";
import Navbar from "@/components/ui/Navbar";

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
  const [createReport] =useCreateReportMutation();
  const [sharePost, { isLoading: isSharing }] = useShareMutation();
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
    



    setpost_id(postId); // Update current post post_id

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



  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
    </div>
      <div className="bg-gray-300 h-min grid grid-cols-7">
        <Navbar/>
        <div className="h-min min-w-max ml-5">
      {isLoading && <Loader />}
      <h1 className="text-2xl font-bold text-center mb-6 pt-7">Friends Posts</h1>
        <div className="grid grid-cols-3 gap-6 ml-8 mt-8">
        {data?.followingPost.map((post: any) => (
          <div key={post.post_id} className="bg-gray-500">
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

    {/* Three vertical dots in a round white div */}
  <div className="absolute -mt-64 ml-72">
  <Popover>
    <PopoverTrigger>
      <div className="rounded-full bg-gray-900 p-2 cursor-pointer">
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
    <PopoverContent className="bg-sky-200">
      {/* Popover content */}
      <div className="p-2 space-x-3 bg-sky-700">
        
        <Dialog>
          <DialogTrigger>
            <Button className="ml-20">Report Post</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Content for updating the post */}
            {/* Add your form fields or content for updating the post here */}
            {/* For example: */}
            <div className="mb-4">
            <Label htmlFor="reason">Reason</Label>
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
        
      </div>
    </PopoverContent>
  </Popover>
  </div>

            </div>
            <div className="flex space-x-2 my-4 px-2">
              <Button onClick={() => handleLike(post.post_id)} className="bg-gray-900">
              <Heart className="mr-2 size-4 fill-red-600" />
              {post.likes} like
              </Button>
              {/* <Button onClick={() => handleComment(post.post_id)}>
                <MessageCircle className="mr-2" />
                {post.comment_count}
                comment
              </Button> */}



<Dialog >
  <DialogTrigger asChild>
    <Button variant="default" onClick={() => handleComment(post.post_id)} className="bg-gray-900">
    <MessageCircle className="mr-2 fill-white size-4" />
      {post.comments} comments
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-4xl max-h-[500px] overflow-y-auto bg-gray-300">
    <DialogHeader>
      <DialogTitle>Post Details</DialogTitle>
      <DialogDescription>Details of the selected post</DialogDescription>
    </DialogHeader>

    {/* Display details of the selected post */}
    <div className="bg-gray-400 shadow rounded-lg p-4">
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
        className="mt-2 bg-gray-900 text-white py-2 px-4 rounded hover:bg-sky-900"
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
        <Button type="button" className="bg-gray-900">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

            <Popover >
              <PopoverTrigger asChild>
                <Button variant="default" onClick={() => handleShare(post.post_id)} 
                className="bg-gray-900 ">
                <Share2 className="mr-2 fill-white size-4"/>
                {post.shares} share</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none" >Share</h4>
                    <input
                      type="text"
                      readOnly
                      value={`http://localhost:3000/getpost?post_id=${post.post_id}`} // Replace `post.id` with the actual post post_id variable
                      className="w-full text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            </div>
          </div>
        ))}
        <Toaster />
        </div>
        </div>
      </div>
    </>
  );
}