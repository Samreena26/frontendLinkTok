'use client'

import React, { useState, useEffect } from 'react';
import { useGetusersearchQuery, useSendRequestMutation, useUnfollowMutation ,useGetFollowingQuery,useGetFollowersQuery} from '@/lib/linkTokApi';
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import Loader from '@/components/ui/Loader';
import Navbar from '@/components/ui/Navbar';

export default function Page() {
  const { toast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const { data, isLoading:seachloading, isError } = useGetusersearchQuery(debouncedSearchText);
  const [sendRequest] = useSendRequestMutation();
  const [unfollow] = useUnfollowMutation();
  const {data: followingData,isLoading:followingsloading, refetch: refetchFollowing}=useGetFollowingQuery();
  const {data: followData,isLoading:followersloading, refetch: refetchFollow}=useGetFollowersQuery();

  const [followStatus, setFollowStatus] = useState({});

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  // Update follow status based on search results
  useEffect(() => {
    if (data?.search) {
      const newFollowStatus = {};
      data.search.forEach((user) => {
        newFollowStatus[user.id] = user.isFollowing;
      });
      setFollowStatus(newFollowStatus);
    }
  }, [data]);
 
  // Handle follow button click
  const handleFollowClick = async (id:number) => {
    try {
      const response= await sendRequest({ target_id: id }).unwrap();
      toast({
        title: 'Success',
        description: response.message,
      });
      // Update follow status
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [id]: true,
      }));
      refetchFollowing();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to follow the user.',
        variant: 'destructive'
      });
    }
  };

  // Handle unfollow button click
  const handleUnfollowClick = async (id:number) => {
    try {
      const response = await unfollow({ target_id: id }).unwrap();
      toast({
        title: 'Success',
        description:  response.message,
      });
      // Update follow status
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [id]: false,
      }));
      refetchFollowing();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unfollow the user.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
    </div>
    <div className="bg-gray-300 h-screen grid grid-cols-7">
      <Navbar/>
        {/* Left column for search and user cards */}
        <div className=" h-screen min-w-max grid grid-cols-5">
        <div className="col-span-1 md:col-span-2 space-y-4 w-min ml-10 mt-10">
          {/* Search bar */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="w-96 p-4 mx-2 my-5 border rounded-2xl shadow-md placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
          />
          {/* User cards */}
          {data?.search.map((result) => (
            <div key={result.id} className=" p-4 rounded-2xl shadow-md flex items-center w-96 mx-4 bg-gray-400">
              <img src={result.profilePictureUrl} alt={result.username} className="h-16 w-16 rounded-full" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold ml-3">{result.username}</h3>
                <p className="text-sm ml-3 text-black">Bio goes here...</p>
              </div>
              {/* Follow/Unfollow button */}
              {followStatus[result.id] ? (
                <button
                  onClick={() => handleUnfollowClick(result.id)}
                  className="px-4 py-2 rounded-2xl bg-gray-800 text-white hover:bg-orange-700 transition duration-300"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => handleFollowClick(result.id)}
                  className="px-4 py-2 rounded bg-gray-800 hover:bg-blue-700 transition duration-300 text-white"
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Right column for following data */}
        <div className=" grid grid-cols-2 col-span-3 mt-12 ml-12">
          {/* Following list */}
          <div className=" p-4 rounded-2xl shadow-md w-60 h-min bg-gray-400">
            <h3 className="text-lg font-semibold mb-4 text-center">Following</h3>
            {followingData?.following.map((result) => (
              <div key={result.target_id} className="flex items-center space-x-4 bg-gray-300 rounded-xl mb-4">
                <img src={result.profilePictureURL} alt={result.username} className="h-16 w-16 rounded-full ml-2 my-2" />
                <div>
                  <h3 className="text-lg font-semibold">{result.username}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Followers list */}
          <div className="p-4 rounded-2xl shadow-md w-60 h-min bg-gray-400">
            <h3 className="text-lg font-semibold mb-4 text-center">Followers</h3>
            {followData?.followers.map((result) => (
              <div key={result.user_id} className="flex items-center space-x-4 bg-gray-300 rounded-xl mb-4">
                <img src={result.profilePictureURL} alt={result.username} className="h-16 w-16 rounded-full ml-2 my-2" />
                <div>
                  <h3 className="text-lg font-semibold">{result.username}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Toaster />
  </>
  
  );
};
