import Link from "next/link";
import React from "react";
import Image from "next/image";
import { lens } from "../assets";

import { IconProps } from "../types/type";

import { NextPage } from "next";
const Icon = ({
  styles,
  name,
  imgUrl,
  isActive,
  disabled,
  handleClick,
}: IconProps) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <Image src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <Image
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);
const Sidebar: NextPage = () => {
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link href="/">
        <Icon
          styles="w-[52px] h-[52px] bg-[#2c2f32]"
          imgUrl={lens}
          name="logo"
          isActive="logo"
          disabled={false}
          handleClick={() => {}}
        />
      </Link>
    </div>
  );
};

export default Sidebar;
