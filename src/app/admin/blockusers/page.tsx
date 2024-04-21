
'use client'

import { useGetBlockedUsersQuery,useUnblockUserMutation } from '@/lib/linkTokApi';
import Loader from '@/components/ui/Loader'
export default function page() {
  const { data: blockusersData, isLoading, error } = useGetBlockedUsersQuery();
const [unblockUser]=useUnblockUserMutation();
  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching active users.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Active Users</h1>
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
               className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
               onClick={() => unblockUser(user.id)}
             >
               unBlock User
             </button>
           </div>
            </li>
            
          ))}
        </ul>
      ) : (
        <div>No block users found.</div>
      )}
    </div>
  );
}
