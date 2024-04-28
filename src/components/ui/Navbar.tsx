'use client';
import {useEffect} from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import { usePathname } from 'next/navigation'; // Corrected import for usePathname

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Updated to use usePathnames

  const Token = localStorage.getItem('token');
  
  // Redirect based on the presence of the token
  useEffect(() => {
    // If there is a token and the user is on the root path, redirect to /home
    if (Token && pathname === '/') {
      router.push('/home');
    } else if (!Token) {
      const allowedPaths = ['/', '/signin', '/signup'];
      if (!allowedPaths.includes(pathname)) {
        router.push('/signin'); // Redirect to signin if on a restricted path
      }
    }
  }, [Token, pathname, router]);

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  // Define paths where the Navbar should not be rendered
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
