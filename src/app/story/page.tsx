"use client";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCreateStoryMutation, useGetuserstoryQuery } from "@/lib/linkTokApi";
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import Navbar from "@/components/ui/Navbar";
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
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
    </div>
      <div className="bg-gray-300 grid grid-cols-6 h-min">
        <Navbar/>
        <div className="h-min min-w-max ml-12">
      <form onSubmit={handleSubmit}>
        <div className="grid max-w-60 mx-auto mt-4">
          <Label htmlFor="media" className=" text-2xl font-bold mt-4 text-center">Create story</Label>
          <Input className="bg-gray-400 mt-4 pl-7 border-stone-950"
            id="picture"
            name="media"
            type="file"
            onChange={handleChange}
          />
        </div>
        <div className="max-w-28 mx-auto mt-2 rounded-lg">
          <Button type="submit" className="bg-gray-800 text-white rounded">Upload story</Button>
        </div>
        <Toaster />
      </form>

      <div className="mx-auto p-4 mt-10">
        <h1 className="text-2xl font-bold text-center mt-4 text-black">Friends Stories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.stories.slice().reverse().map((stories) => (
            
            <div key={stories.user_id} className="bg-gray-500 shadow rounded-lg p-4 mt-8 w-80 h-min">
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
      </div>
      </div>

    </>
  );
}
