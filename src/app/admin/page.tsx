'use client'

export default function page() {
    return (
      
      <div className="h-screen bg-lime-300">
       <button className="bg-gray-900 rounded-lg w-48 mt-72 ml-64">
        <a href="admin/reports" className="ml-2 text-white">Go to Admin Dashboard</a>
       </button>
        <div className="flex bg-lime-600 h-16 w-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 animate-type overflow-hidden border-r-2 border-gray-800 whitespace-nowrap text-center ">
          Welcome to Admin Panel
        </h1>
        </div>
  
        <style jsx>{`
          @keyframes typewriter {
            from { width: 0; }
            to { width: 31%; }
          }
          .animate-type {
            animation: typewriter 5s steps(30) 1s infinite normal both,
                       blink-caret .75s step-end infinite;
          }
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: currentColor }
          }
        `}</style>
      </div>
    
      
    );
    
  }
  