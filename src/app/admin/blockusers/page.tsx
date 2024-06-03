
'use client'

import { useGetBlockedUsersQuery,useUnblockUserMutation } from '@/lib/linkTokApi';
import Loader from '@/components/ui/Loader'
import Navbar from '@/components/ui/Navbar';
export default function page() {
  const { data: blockusersData, isLoading, error,refetch } = useGetBlockedUsersQuery();
const [unblockUser]=useUnblockUserMutation();
  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching active users.</div>;


const handleUnblockUser = async(userid:number) => {
try{
  await unblockUser(userid).unwrap();
  refetch()
}catch (err) {
  console.error('Failed to block report or delete report:', err);
}
  

}





  return (
    <>
    <div className="bg-gray-800 h-12 ml-54 flex items-center">
      <h1 className="text-gray-300 ml-96 tracking-widest text-xl"> API WEB BASED SOCIAL MEDIA PLATFORM LINKTOK</h1>
      <h1 className="text-gray-600 ml-44"> Design by Samreena Haseeb </h1>
  </div>
    <div className="bg-pink-300 grid grid-cols-6 h-min">
      <Navbar/>
      <div className="h-min min-w-max mt-2 mb-6">
      <h1 className="text-2xl font-bold">Block Users</h1>
      {blockusersData && blockusersData.blockedUsers.length > 0 ? (
        <ul>
          {blockusersData.blockedUsers.map((user) => (
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
              <div>
             <button
               className="bg-gray-900 text-white px-3 py-1 rounded ml-12 mt-5"
               onClick={() => handleUnblockUser(user.id)}
             >
               Unblock User
             </button>
           </div>
            </li>
            
          ))}
        </ul>
      ) : (
        <div>No block users found.</div>
      )}
      </div>
    </div>
    </>
  );
}
