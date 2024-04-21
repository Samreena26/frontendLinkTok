'use client'

import Loader from '@/ui/Loader';
import { useGetInactiveUsersQuery } from '@/lib/linkTokApi';

export default function page() {
  const { data: inactiveUsersData, isLoading, error } = useGetInactiveUsersQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching active users.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">inActive Users</h1>
      {inactiveUsersData && inactiveUsersData.inactiveUsers.length > 0 ? (
        <ul>
          {inactiveUsersData.inactiveUsers.map((user) => (
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
        <div>No inactive users found.</div>
      )}
    </div>
  );
}
