"use client";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCreateStoryMutation, useGetuserstoryQuery } from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
interface FormState {
  media: File | null;
}
export default function page() {
  const { toast } = useToast();

  const [formData, setformData] = useState<FormState>({ media: null });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setformData({ ...formData, media: e.target.files[0] });
    }
  };

  const [createStory]=useCreateStoryMutation();
  const apiFormData = new FormData();
  formData.media && apiFormData.append("media", formData.media);
 
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await createStory(apiFormData).unwrap();
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

 const {data}=useGetuserstoryQuery(); 
console.log(data);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="media">upload story</Label>
          <Input
            id="picture"
            name="media"
            type="file"
            onChange={handleChange}
          />
        </div>
        <div>
          <Button type="submit">upload story</Button>
        </div>
        <Toaster />
      </form>


      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Your Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.stories.slice().reverse().map((stories) => (
            
            <div key={stories.user_id} className="bg-white shadow rounded-lg p-4">
               <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{stories.username}</h2>
              </div>
              {stories.storyType === 'photo' ? (
             <img className="h-48 w-full object-contain rounded-t-lg" src={stories.mediaURL} alt="Post Media" />
              ) : (
              // Display video if it's a video
              <video
                className="h-48 w-full object-contain rounded-t-lg"
                controls
                muted
                loop
              >
                <source src={stories.mediaURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

             
            </div>
          ))}
          </div>
      </div>

    </>
  );
}
