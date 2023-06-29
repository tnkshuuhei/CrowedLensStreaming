"use client";
import React from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { money } from "../assets";
import { checkIfImage } from "../utils";
import { useStateContext } from "../context";
import FormField from "../components/FormField";
import Image from "next/image";
import { CustomButton, Layout, Loader } from "../components";
import { NextPage } from "next";

const CreateCampaign: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    recipient: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const { publishProject } = useStateContext();
  const handleFormFieldChange = (
    fieldName: string,
    e: { target: { value: any } }
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
    console.log(e.target.value);
    console.log(form);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    checkIfImage(form.image, async (exists: any) => {
      if (exists) {
        setIsLoading(true);
        await publishProject({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        router.push("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };
  return (
    <Layout>
      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
        {isLoading && <Loader />}
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
            Start a Campaign
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full mt-[65px] flex flex-col gap-[30px]"
        >
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Recipient Address *"
              placeholder="0x123....234"
              inputType="text"
              isTextArea={false}
              value={form.recipient}
              handleChange={(e: { target: { value: any } }) =>
                handleFormFieldChange("recipient", e)
              }
              handleTextChange={(e: { target: { value: any } }) =>
                console.log(e.target.value)
              }
            />
            <FormField
              labelName="Campaign Title *"
              placeholder="Write a title"
              inputType="text"
              isTextArea={false}
              value={form.title}
              handleChange={(e: { target: { value: any } }) =>
                handleFormFieldChange("title", e)
              }
              handleTextChange={(e: { target: { value: any } }) =>
                console.log(e.target.value)
              }
            />
          </div>

          <FormField
            labelName="Story *"
            placeholder="Write your story"
            inputType="text"
            isTextArea={true}
            value={form.description}
            handleChange={(e: { target: { value: any } }) =>
              console.log("This is disabled")
            }
            handleTextChange={(e: { target: { value: any } }) =>
              handleFormFieldChange("description", e)
            }
          />

          <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
            <Image
              src={money}
              alt="money"
              className="w-[40px] h-[40px] object-contain"
            />
            <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
              You will get 100% of the raised amount
            </h4>
          </div>

          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Goal *"
              placeholder="ETH 0.50"
              inputType="text"
              isTextArea={false}
              value={form.target}
              handleChange={(e: { target: { value: any } }) =>
                handleFormFieldChange("target", e)
              }
              handleTextChange={(e: { target: { value: any } }) =>
                console.log(e.target.value)
              }
            />
            <FormField
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              isTextArea={false}
              value={form.deadline}
              handleChange={(e: { target: { value: any } }) =>
                handleFormFieldChange("deadline", e)
              }
              handleTextChange={(e: { target: { value: any } }) =>
                console.log(e.target.value)
              }
            />
          </div>

          <FormField
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            isTextArea={false}
            value={form.image}
            handleChange={(e: { target: { value: any } }) =>
              handleFormFieldChange("image", e)
            }
            handleTextChange={(e: { target: { value: any } }) =>
              console.log("This is disabled")
            }
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#1dc071]"
              handleClick={() => {
                handleSubmit;
              }}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateCampaign;
