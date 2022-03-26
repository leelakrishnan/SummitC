import React from "react";
import Image from "next/image";

export default function CardOne({ title, description, imageUrl }) {
  return (
    <div className="max-w-lg mx-auto mt-8 h-64 space-y-2 p-8 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-lg shadow-md shadow-slate-300 sm:flex items-center sm:py-4 sm:space-x-6">
      {/* <img
        src={imageUrl}
        className=" mx-auto w-24 h-48 rounded-full sm:mx-0 sm:shrink-0"
        alt="logo"
      /> */}

      <div className="w-48 h-48 relative">
        <Image src={imageUrl} layout="fill" />
      </div>

      <div className="text-center">
        <div className="space-y-0.5">
          <p className="text-xl font-semibold text-stone-900  ">{title}</p>
          <p className="text-slate-200 font-medium text-md">{description}</p>
        </div>
      </div>
    </div>
  );
}
