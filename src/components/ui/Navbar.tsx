'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';




const Navbar: React.FC = () => {
  
  const router = useRouter();
  const pathname = usePathname();

  const Token=localStorage.getItem('token');
  if(!Token){
    router.push('/')
  }


  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  const noNavbarPaths = ['/', '/signup', '/signin'];

  // Do not render the Navbar on specified paths
  if (noNavbarPaths.includes(pathname)) {
    return null;
  }

  // Render admin-specific navigation if on an admin route
  if (isAdminRoute) {
    return (
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <span className="text-xl cursor-pointer" onClick={() => router.push('/admin')}>LinkTok</span>
      <div className="flex-1 text-center space-x-6">
        <span className="text-xl cursor-pointer" onClick={() => router.push('/admin/reports')}>reports</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/admin/activeusers')}>Active Users</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/admin/inactiveusers')}>Inactive users</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/admin/blockusers')}>block users</span>
      </div>
      
    </nav>
    );
  }

  // Render the regular navigation for non-admin routes
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <span className="text-xl cursor-pointer" onClick={() => router.push('/home')}>LinkTok</span>
      <div className="flex-1 text-center space-x-6">
        <span className="text-xl cursor-pointer" onClick={() => router.push('/home')}>Home</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/story')}>Story</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/friends')}>Friends</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/posts')}>Posts</span>
        <span className="text-xl cursor-pointer" onClick={() => router.push('/foryou')}>For you</span>
      </div>
      <span className="text-xl cursor-pointer" onClick={() => router.push('/account')}>Account</span>
    </nav>
  );
};

export default Navbar;
