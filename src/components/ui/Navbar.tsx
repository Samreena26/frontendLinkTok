'use client';
// import { useRouter } from 'next/navigation';
// import { usePathname } from 'next/navigation';
import { useState } from 'react';
// import { useEffect } from 'react';
import {useEffect} from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import { usePathname } from 'next/navigation'; // Corrected import for usePathname

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Updated to use usePathnames

  
  
  // Redirect based on the presence of the token
  useEffect(() => {
    const Token = localStorage.getItem('token');
    // If there is a token and the user is on the root path, redirect to /home
    if (Token && pathname === '/') {
      router.push('/home');
    } else if (!Token) {
      const allowedPaths = ['/', '/signin', '/signup'];
      if (!allowedPaths.includes(pathname)) {
        router.push('/signin'); // Redirect to signin if on a restricted path
      }
    }
  }, [ pathname, router]);

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  // Function to check if a given path matches the current route
  const isActive = (path: string) => {
    return pathname === path;
  };
  // Define paths where the Navbar should not be rendered
  const noNavbarPaths = ['/', '/signup', '/signin'];

  // Do not render the Navbar on specified paths
  if (noNavbarPaths.includes(pathname)) {
    return null;
  }

  // Render admin-specific navigation if on an admin route
  if (isAdminRoute) {
    return (
      <nav className="flex flex-col items-center bg-gray-800 text-white w-48 h-screen target:text-orange-600">
       <div className='flex items-center mb-10 bg-lime-600 w-48 h-14'>
        <span className="text-xl cursor-pointer ml-14" onClick={() => router.push('/admin')}>LinkTok</span>
        </div>
        <div className="flex flex-col space-y-4">
          <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/admin/reports') ? 'text-orange-600' : ''}`} onClick={() => router.push('/admin/reports')}>Reports</span>
          <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/admin/activeusers') ? 'text-orange-600' : ''}`} onClick={() => router.push('/admin/activeusers')}>Active Users</span>
          <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/admin/inactiveusers') ? 'text-orange-600' : ''}`} onClick={() => router.push('/admin/inactiveusers')}>Inactive users</span>
          <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/admin/blockusers') ? 'text-orange-600' : ''}`} onClick={() => router.push('/admin/blockusers')}>Block users</span>
        </div>
      </nav>
    );
  }

  // Render the regular navigation for non-admin routes
  return (
    <nav className="flex flex-col items-center bg-gray-800 text-white w-48 h-screen target:text-orange-600">
      <div className='flex items-center mb-10 bg-lime-600 w-48 h-14'>
        <span className="text-xl cursor-pointer ml-14" onClick={() => router.push('/home')}>LinkTok</span>
      </div>
      <div className="flex flex-col space-y-6">
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/home') ? 'text-orange-600' : ''}`} onClick={() => router.push('/home')}>Home</span>
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/story') ? 'text-orange-600' : ''}`} onClick={() => router.push('/story')}>Story</span>
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/friends') ? 'text-orange-600' : ''}`} onClick={() => router.push('/friends')}>Friends</span>
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/posts') ? 'text-orange-600' : ''}`} onClick={() => router.push('/posts')}>Posts</span>
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/foryou') ? 'text-orange-600' : ''}`} onClick={() => router.push('/foryou')}>For you</span>
        <span className={`text-xl cursor-pointer text-center hover:bg-lime-600 hover:h-7 hover:w-48 ${isActive('/account') ? 'text-orange-600' : ''}`} onClick={() => router.push('/account')}>Account</span>
      </div>
    </nav>
  );
};

export default Navbar;
