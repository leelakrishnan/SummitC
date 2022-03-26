import React from "react";
import Image from "next/image";

export default function Card({ title, description, imageUrl }) {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white-700 rounded-xl shadow-lg shadow-slate-400 flex  items-center space-x-4">
      <div className="shrink-0 h-24 w-24 relative">
        {/* <img className="h-12 w-78" src="wave.png" alt="logo" /> */}
        <Image src={imageUrl} layout="fill" />
      </div>
      <div>
        <h3 className="text-2xl font-medium text-black">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
    </div>
  );
}
