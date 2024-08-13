
import Image from "next/image";


export default function SideBar() {
  return (
    <div className="h-screen px-4 pt-8 pb-4 bg-blue-50 flex flex-col justify-between w-80">
      <div className="flex flex-col items-center">
       
        <div className="w-24 h-24 mb-4">
          <Image 
            src="/image.png"
            alt=""
            width={90} 
            height={90}
            className="rounded-full border-2 border-blue-300"
          />
        </div>
        <p className="text-xl font-semibold mb-4">Hi UserName</p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}

