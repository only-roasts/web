import { Flame } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center pt-5 pb-28">
        <div className=" relative text-5xl text-[#FF5159] font-bold flex ">
          <p>Only</p>
          <Flame className=" w-12 h-12 inline-block  " />
          <p>Roasts</p>
        </div>
        <p className="text-[50px]">DEMO TIME</p>
      </div>
    </div>
  );
};

export default page;
