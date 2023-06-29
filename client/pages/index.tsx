"use client";
import type { NextPage } from "next";
import { Navbar, Sidebar } from "../components";

const Page: NextPage = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
      </div>
    </div>
  );
};

export default Page;
