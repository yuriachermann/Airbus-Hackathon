import React from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { api } from "~/utils/api";
import { QueryClient } from "@tanstack/query-core";
import { createId } from "@paralleldrive/cuid2";

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

  const handleCreateOrder = ({
    orderID,
    user,
    // food,
    city,
  }: {
    orderID: string;
    user: string;
    // food: string;
    city: string;
  }) => {
    // Continue with the existing mutation after the file has been uploaded
    void createOrder({
      orderID: orderID,
      orderUser: user,
      // orderFood: food,
      orderCity: city,
    }).then(() => utils.invalidate());
    close();
  };

  const promptText =
    "ANSWER JUST WITH THE NAME OF ONE DISH CONSIDERING THE CONDITIONS (If there are no conditions just give any random dish name, but just say the name and nothing more)";


  return (
    <Layout>
      <main className="grow">
        <div className="ml-40 mt-6">
          <div className="m-0 text-[17px] font-bold text-mauve12">
            Place order
          </div>
          <div className="mb-5 mt-[10px] text-[15px] leading-normal text-slate-700">
            Here you will provide your name and food preferences and we will
            select a surprise meal for you based on that
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            fetchLocation();
            if (values.firstName == "") {
              alert("Provide at least your name");
            } else {
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
                        content: `CONDITIONS: [Meal Time=${values.mealTime}, Cuisine Preference=${values.cuisinePreference}, Spiciness Level=${values.spiciness}, Dietary Restrictions=${values.restriction}, Allergies=${values.allergies}] ${promptText}`,
                      },
                    ],
                  }),
                })
                .then((response: any) => {
                  console.log(
                    JSON.stringify(response.data.choices[0].message.content)
                  );
                  const food = JSON.stringify(
                    response.data.choices[0].message.content
                  ).replace(/^"|"$/g, "");
                  const orderID = createId();
                  handleCreateOrder({
                    orderID: orderID,
                    user: values.firstName,
                    // food: food,
                    city: city,
                  });
                  setTimeout(() => {
                  window.location.href = `/logistics?dish=${food}&user=${values.firstName}&orderID=${orderID}`;
                  }, 500);
                  })
                .catch((error: any) => {
                  console.log(error);
                });
            }
          }}
        >
          {() => (
            <Form className="rounded-2xl bg-[#3f3f3f] p-12 md:mx-32">
              <div className="ml-12 flex justify-between">
                <label
                  htmlFor="firstName"
                  className="block basis-1/2 pr-4 font-bold text-gray-200"
                >
                  Name
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder="Input your name"
                  className="mr-40 block w-40 basis-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:w-96"
                />
              </div>
              {foodIputs.map((input) => (
                <div key={input.value}>
                  <div className="my-8 h-[1px] w-full bg-gray-300" />
                  <div className="ml-12 flex justify-between">
                    <div
                      id="my-radio-group"
                      className="block basis-1/2 pr-4 font-bold text-gray-200"
                    >
                      {input.label}
                    </div>
                    <div
                      role="group"
                      aria-labelledby="my-radio-group"
                      className=" flex basis-1/2 flex-col"
                    >
                      {input.options.map((option) => (
                        <label
                          key={option}
                          className="pr-4 font-bold text-gray-200"
                        >
                          <Field
                            type="radio"
                            name={input.value}
                            value={option}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="btn group mt-20 w-full bg-gradient-to-t from-orange-800 to-orange-700 text-white shadow-lg hover:to-orange-500"
              >
                Place order
                <span className="ml-1 tracking-normal text-orange-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </Layout>
  );
}

export default Ordering;
