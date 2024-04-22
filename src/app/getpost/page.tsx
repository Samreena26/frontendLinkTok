'use client'
import { useSearchParams } from 'next/navigation';
import { useGetPostQuery } from '@/lib/linkTokApi';
import Loader from '@/ui/Loader';

export default function page() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('post_id');
  const { data, error, isLoading } = useGetPostQuery(searchQuery);

  if (isLoading) return <Loader/>;
  if (error) return <p>Error</p>;

  const { caption, likes, mediaUrl, tags, postType } = data;

  return (
    
    <div>
         <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{caption}</h2>
        <p className="text-gray-600">Tags: {tags}</p>
      
        {/* Add other relevant post details */}
      </div>
      {postType === 'photo' ? (
        <img
          className="h-48 w-full object-contain rounded-t-lg"
          src={mediaUrl}
          alt="Post Media"
        />
      ) : (
        <video
          className="h-48 w-full object-contain rounded-t-lg"
          controls
          muted
          loop
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

     
    </div>
  );
}
