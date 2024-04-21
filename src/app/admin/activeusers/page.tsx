'use client'

import Loader from '@/ui/Loader';
import { useGetActiveUsersQuery } from '@/lib/linkTokApi';

export default function page() {
  const { data: activeUsersData, isLoading, error } = useGetActiveUsersQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching active users.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Active Users</h1>
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
  );
}
