"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "./CustomButton";
import { logo, menu, search, thirdweb, lens } from "../assets";
import { navlinks } from "../constants";
import { useRouter } from "next/router";
import { useStateContext } from "../context";
import { LensClient, development, production } from "@lens-protocol/client";
import { NextPage } from "next";

const Navbar: NextPage = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connectWallet, address } = useStateContext();
  const [searchValue, setSearchValue] = useState("");
  const lensClient = new LensClient({
    environment: production,
  });

  const [profiles, setProfiles] = useState<
    Array<{
      handle: string;
      name: string;
      address: string;
      avatar: string;
      bio: string;
    }>
  >([]);

  const [query, setQuery] = useState({});
  const handleSetValue = (e: { target: { value: any } }) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };
  useEffect(() => {
    console.log("profiles: ", profiles);
  }, [query, profiles]);

  const handleSearch = async (value: string) => {
    try {
      const result = await lensClient.search.profiles({
        query: value,
        limit: 5,
      });
      setQuery(result.items);
      const queryProfiles = result.items.map((item: any) => ({
        handle: item.handle,
        name: item.name,
        address: item.ownedBy,
        avatar: item.picture?.original?.url || "",
        bio: item.bio,
      }));
      setProfiles(queryProfiles);
    } catch (error) {
      console.log(error);
    }
  };

  const handlechange = (profile: any) => {
    console.log("profile: ", profile);
    router.push(`/CreateCampaign?address=${profile.address}`);
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search lens profile"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          onChange={(e: { target: { value: any } }) => handleSetValue(e)}
        />
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <Image
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
            onClick={() => handleSearch(searchValue)}
          />
        </div>
        <div className="rounded-xl z-10">
          <div className="max-w-[458px] absolute top-[80px] left-[175px] right-0  bg-[#1c1c24] z-10 shadow-secondary rounded-lg">
            <ul>
              {profiles.map((profile) => (
                <li
                  key={profile.handle}
                  className="px-2 flex hover:bg-gray-600 rounded-lg cursor-pointer
									"
                  onClick={() => handlechange(profile)}
                >
                  <Image
                    src={profile.avatar}
                    width={20}
                    height={20}
                    alt={profile.name}
                    className="h-12 w-12 my-2 rounded-full object-contain"
                  ></Image>
                  <div className="mx-2 my-2">
                    <p className="text-white">{profile.name}</p>
                    <p className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent ">
                      {profile.handle}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={
            address
              ? address.slice(0, 6) + "..." + address.slice(-4)
              : "Connect"
          }
          styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            if (address) router.push("/CreateCampaign");
            else connectWallet();
          }}
        />

        <Link href="/Profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <Image
              src={lens}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <Image
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <Image
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  router.push(link.link);
                }}
              >
                <Image
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={
                address
                  ? address.slice(0, 6) + "..." + address.slice(-4)
                  : "Connect"
              }
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={() => {
                if (address) router.push("/CreateCampaign");
                else connectWallet();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

function getGateway(hashoruri: any) {
  if (hashoruri.includes("https")) {
    return hashoruri;
  }
  if (hashoruri.includes("ipfs://")) {
    console.log(
      "ipfs: ",
      hashoruri.replace("ipfs://", "https://ipfs.io/ipfs/")
    );
    return hashoruri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (hashoruri.includes("ar://")) {
    console.log("ar: ", hashoruri.replace("ar://", "https://arweave.net/"));
    return hashoruri.replace("ar://", "https://arweave.net/");
  }
}
