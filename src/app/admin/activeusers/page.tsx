'use client'

import Loader from '@/ui/Loader';
import { useGetActiveUsersQuery } from '@/lib/linkTokApi';
import Navbar from '@/components/ui/Navbar';

export default function page() {
  const { data: activeUsersData, isLoading, error } = useGetActiveUsersQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching active users.</div>;

  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
  </div>
    <div className="bg-pink-300 grid grid-cols-6 h-min">
      <Navbar/>
      <div className="h-min min-w-max mt-2 mb-6">
      <h1 className="text-2xl font-bold ml-8">Active Users</h1>
      {activeUsersData && activeUsersData.activeUsers.length > 0 ? (
        <ul>
          {activeUsersData.activeUsers.map((user) => (
            <li key={user.id} className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePictureUrl}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Bio:</strong> {user.userBio || 'Not provided'}</p>
                  {/* Add more user details as needed */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No active users found.</div>
      )}
      </div>
    </div>
    </>
  );
}
