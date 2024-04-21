'use client'

export default function page() {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 animate-type overflow-hidden border-r-2 border-gray-800 whitespace-nowrap">
          Welcome to Admin Panel
        </h1>
  
        <style jsx>{`
          @keyframes typewriter {
            from { width: 0; }
            to { width: 31%; }
          }
          .animate-type {
            animation: typewriter 4s steps(30) 1s infinite normal both,
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
  