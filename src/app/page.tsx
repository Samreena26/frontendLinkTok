// home page of the linktok it will be the landing page
'use client'
export default function Page() {
	return (
		<>
		<div className="h-screen bg-gray-400">
		<div>
       <button className="bg-gray-900 rounded-lg w-28 mt-10 ml-96 h-10">
        <a href="signin" className="ml-2 text-white">Signin</a>
       </button>
	   <button className="bg-gray-900 rounded-lg w-28 mt-10 ml-96 h-10">
        <a href="signup" className="ml-2 text-white">Signup</a>
       </button>
	   </div>
        <div className="flex bg-gray-600 h-16 w-screen items-center justify-center mt-64">
        <h1 className="text-4xl font-bold text-gray-900 animate-type overflow-hidden border-r-2 border-gray-800 whitespace-nowrap text-center ">
          Welcome to LinkTok platform
        </h1>
        </div>
  
        <style jsx>{`
          @keyframes typewriter {
            from { width: 0; }
            to { width: 36%; }
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
		</>
	);
}
