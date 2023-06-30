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
  const query = router.query.address;
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    recipient: query,
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
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-[30px]"
        >
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Recipient Address *"
              placeholder={query}
              inputType="text"
              isTextArea={false}
              isDiabled={true}
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
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Goal *"
              placeholder="1,000 DAIx"
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
              title="Create a New Project"
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
