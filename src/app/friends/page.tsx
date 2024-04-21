'use client'

import React, { useState, useEffect } from 'react';
import { useGetusersearchQuery, useSendRequestMutation, useUnfollowMutation ,useGetFollowingQuery,useGetFollowersQuery} from '@/lib/linkTokApi';
import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";
import Loader from '@/components/ui/Loader';

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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column for search and user cards */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {/* Search bar */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="w-full md:w-3/4 p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* User cards */}
         <div>
          
          {data?.search.map((result) => (
            <div key={result.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
              <img src={result.profilePictureUrl} alt={result.username} className="h-16 w-16 rounded-full" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{result.username}</h3>
                <p className="text-sm text-gray-600">Bio goes here...</p>
              </div>
              {/* Follow/Unfollow button */}
              {followStatus[result.id] ? (
                <button
                  onClick={() => handleUnfollowClick(result.id)}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => handleFollowClick(result.id)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-300"
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
        </div>
        {/* Right column for following data */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          {/* Following list */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Following</h3>
            {followingsloading && <Loader/>}
            {followingData?.following.map((result) => (
              <div key={result.target_id} className="flex items-center space-x-4">
                <img src={result.profilePictureURL} alt={result.username} className="h-16 w-16 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold">{result.username}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Followers list */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Followers</h3>
            {followersloading && <Loader/>}
            {followData?.followers.map((result) => (
              <div key={result.user_id} className="flex items-center space-x-4">
                <img src={result.profilePictureURL} alt={result.username} className="h-16 w-16 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold">{result.username}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  </>
  
  );
};
