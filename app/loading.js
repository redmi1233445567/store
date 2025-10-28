export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-4 h-4 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
      <p className="mt-6 text-gray-600 font-medium animate-pulse">
        برجاء الانتظار...
      </p>
    </div>
  );
}
