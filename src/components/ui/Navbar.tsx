'use client'
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <span className="text-xl cursor-pointer" onClick={() => router.push('/home')}>LinkTok</span>
      <div className="flex-1 text-center space-x-6">
      <span className="text-xl cursor-pointer" onClick={() => router.push('/home')}>Home</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/story')}>story</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/friends')}>friends</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/posts')}>posts</span>
      </div>
      <span className="text-xl cursor-pointer" onClick={() => router.push('/account')}>Account</span>
    </nav>
  );
};

export default Navbar;
