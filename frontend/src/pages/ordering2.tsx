import React, { useState } from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { api } from "~/utils/api";
import { QueryClient } from "@tanstack/query-core";
import { createId } from "@paralleldrive/cuid2";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const queryClient = new QueryClient();

interface MyFormValues {
  firstName: string;
  spiciness: string;
  restriction: string;
  mealTime: string;
  cuisinePreference: string;
  allergies: string;
}

function Ordering() {
  const initialValues: MyFormValues = {
    firstName: "",
    spiciness: "",
    restriction: "",
    mealTime: "",
    cuisinePreference: "",
    allergies: "",
  };

  const foodIputs = [
    {
      value: "mealTime",
      label: "Meal Time",
      options: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      value: "cuisinePreference",
      label: "Cuisine Preference",
      options: [
        "American",
        "Asian",
        "European",
        "Latin American",
        "Middle Eastern",
      ],
    },
    {
      value: "spiciness",
      label: "Spiciness Level",
      options: ["Mild", "Medium", "Spicy"],
    },
    {
      value: "restriction",
      label: "Dietary Restrictions",
      options: ["None", "Vegan", "Vegetarian", "Gluten-Free"],
    },
    {
      value: "allergies",
      label: "Allergies",
      options: ["None", "Dairy", "Eggs", "Nuts", "Shellfish"],
    },
  ];

  const [city, setCity] = React.useState("");

  const fetchLocation = async () => {
    const apiURL = "https://ipgeolocation.abstractapi.com/v1/";
    const apiKey = "afe9fb78a04a4f88a6fe754896ec88b2";

    try {
      const response = await axios.get(apiURL, {
        params: { api_key: apiKey },
      });
      if (response.data.city) {
        setCity(response.data.city);
      }
    } catch (error: any) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        error.response.status === 429
      ) {
        console.error("Rate limit reached. Try again later.");
      } else {
        console.error("There was an error fetching the data:", error);
      }
    }
  };

  fetchLocation();
  console.log(city);

  const { mutateAsync: createOrder } = api.order.create.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(["order.read"], data);
    },
    onError: () => {
      console.log("error while creating order");
    },
  });

  const utils = api.useContext();

  const handleCreateTalk = ({
    orderID,
    orderAsk,
    city,
  }: {
    orderID: string;
    orderAsk: string;
    // food: string;
    city: string;
  }) => {
    // Continue with the existing mutation after the file has been uploaded
    void createOrder({
      orderID: orderID,
      orderAsk: orderAsk,
      // orderFood: food,
      orderCity: city,
    }).then(() => utils.invalidate());
    close();
  };

  const promptText =
    "ANSWER JUST WITH THE NAME OF ONE DISH CONSIDERING THE CONDITIONS (If there are no conditions just give any random dish name, but just say the name and nothing more)";

  const [outputValue, setOutputValue] = useState("");

  const [category, setCategory] = useState("airbus");

  return (
    <Layout>
      <main className="relative">
        <div className="z-30 py-20 md:py-40">
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              // fetchLocation()
              actions.setSubmitting(false);
              await axios
                .request({
                  method: "post",
                  maxBodyLength: Infinity,
                  url: "https://api.openai.com/v1/chat/completions",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_TOKEN}`,
                  },
                  data: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                      {
                        role: "user",
                        content: `${values.firstName}`,
                      },
                    ],
                  }),
                })
                .then((response: any) => {
                  console.log(
                    JSON.stringify(response.data.choices[0].message.content)
                  );
                  console.log("response", JSON.stringify(response));
                  const orderID = createId();
                  handleCreateTalk({
                    orderID: orderID,
                    orderAsk: values.firstName,
                    city: city,
                  });
                  setOutputValue(
                    JSON.stringify(
                      response.data.choices[0].message.content
                    ).replace(/^"|"$/g, "")
                  );
                })
                .catch((error: any) => {
                  console.log(error);
                });
            }}
          >
            {() => (
              <Form className="z-10 flex flex-col rounded-2xl bg-[#3f3f3f]/80 p-12 md:mx-32 items-center">
                <div className="mx-12 flex w-full justify-between">
                  <label
                    htmlFor="firstName"
                    className="block basis-1/12 pr-4 font-bold text-gray-200"
                  >
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                          aria-label="Customise options"
                        >
                          <HamburgerMenuIcon />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
                          sideOffset={5}
                        >
                          {/*<DropdownMenu.Label className="pl-[25px] text-xs leading-[25px] text-mauve11">*/}
                          {/*  Category*/}
                          {/*</DropdownMenu.Label>*/}
                          <DropdownMenu.RadioGroup
                            value={category}
                            onValueChange={setCategory}
                          >
                            <DropdownMenu.RadioItem
                              className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
                              value="airbus"
                            >
                              <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                                <DotFilledIcon />
                              </DropdownMenu.ItemIndicator>
                              AIRBUS
                            </DropdownMenu.RadioItem>
                            <DropdownMenu.RadioItem
                              className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
                              value="cybersecurity"
                            >
                              <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                                <DotFilledIcon />
                              </DropdownMenu.ItemIndicator>
                              Cybersecurity
                            </DropdownMenu.RadioItem>
                            <DropdownMenu.RadioItem
                              className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
                              value="ai"
                            >
                              <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                                <DotFilledIcon />
                              </DropdownMenu.ItemIndicator>
                              Data Analytics & AI
                            </DropdownMenu.RadioItem>
                            <DropdownMenu.RadioItem
                              className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
                              value="erp"
                            >
                              <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                                <DotFilledIcon />
                              </DropdownMenu.ItemIndicator>
                              Enterprise Resource Planning
                            </DropdownMenu.RadioItem>
                            <DropdownMenu.RadioItem
                              className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
                              value="systems_engineering"
                            >
                              <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                                <DotFilledIcon />
                              </DropdownMenu.ItemIndicator>
                              Model Based Systems Engineering
                            </DropdownMenu.RadioItem>
                          </DropdownMenu.RadioGroup>

                          <DropdownMenu.Arrow className="fill-white" />
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    placeholder="Write your question here"
                    className="md:mr-20 block w-40 basis-11/12 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-96"
                  />
                </div>
                <button
                  type="submit"
                  className="btn group my-10 w-[50vw] md:w-[15vw] max-w-[960px] bg-gradient-to-t from-[#005587] to-[#0085AD] text-white shadow-lg hover:to-[#00205B] focus:to-[#00205B]"
                >
                  Ask
                  <span className="ml-1 tracking-normal text-orange-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </button>
                {/*<div className="my-8 h-[1px] w-full bg-gray-300"/>*/}
                <div className="ml-12 flex justify-between self-start">
                  <label
                    htmlFor="firstName"
                    className="block basis-1/2 pr-4 font-bold text-gray-200"
                  >
                    Answer:
                  </label>
                  <span className="">{outputValue}</span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        {category != "airbus" && (
          <div className="absolute top-0 -z-10 -mt-24 h-[100vh] w-[100vw] opacity-50">
            <Image
              src={`/backgrounds/${category}.png`}
              alt="background"
              className="object-cover"
              layout="fill"
              quality={100}
            />
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Ordering;
