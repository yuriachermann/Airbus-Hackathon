import React from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
// import axios from "axios";
import { createId } from "@paralleldrive/cuid2";
import Logo from "~/components/3dLogo";
import { useRouter } from "next/router";

function Delivery() {
  const router = useRouter();
  const routeUser: string | undefined = Array.isArray(router.query.user)
    ? router.query.user[0]
    : router.query.user;
  const routeFood: string | undefined = Array.isArray(router.query.dish)
    ? router.query.dish[0]
    : router.query.dish;
  const routeOrderID: string | undefined = Array.isArray(router.query.orderID)
    ? router.query.orderID[0]
    : router.query.orderID;
  const routeCity: string | undefined = Array.isArray(router.query.city)
    ? router.query.city[0]
    : router.query.city;

  const [processedVoice, setProcessedVoice] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [deliveryVoiceID, setDeliveryVoiceID] = React.useState(createId());


  const handleDetect = async () => {
    setLoading(true);

    try {
      /*const responseAPI = await axios.post(
        `http://172.174.255.171:5004/generate?delivery_voice_id=${deliveryVoiceID}&user=${routeUser}&food=${routeFood}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );*/
      setDeliveryVoiceID("Hello%20Yuri%20Achermann.mp3");
      const audioURL =
        `https://tooldetectivestorageacc.blob.core.windows.net/intel-hackathon/delivery_voice/${deliveryVoiceID}`;
      const response = await fetch(audioURL, {
        mode: "no-cors",
      });
      const audio = await response.blob();
      const audioFile = new File([audio], "myAudio.mp3", { type: "audio/mp3" });
      setProcessedVoice(audioFile);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload the file");
    } finally {
      setLoading(false);
    }
  };
  console.log(processedVoice);

  return (
    <Layout>
      <main className="grow">
        <div className="flex items-center justify-center">
          <div className="ml-20 flex h-[75vh] basis-1/2 flex-col justify-start">
            <div className="m-0 mt-6 text-[17px] font-bold text-mauve12">
              Delivery
            </div>
            <div className="mb-8 mt-[10px] text-[15px] leading-normal text-slate-700">
              Drone generates voice message for the client announcing the
              arrival
            </div>
            {/* Show info about the client location and order */}
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-700">
                Hello, {routeUser ? routeUser : "user"}! Your{" "}
                {routeFood ? routeFood : "food"} has arrived.
              </span>
              <span className="text-[15px] font-bold text-slate-700">
                Your order ID is: {routeOrderID}
              </span>
              <span className="text-[15px] font-bold text-slate-700">
                Your order was delivered in {routeCity}.
              </span>
              <button
                className="btn group mx-20 mt-6 bg-gradient-to-t from-blackA11 to-blackA9 text-white shadow-lg hover:to-gray-800"
                type="button"
                onClick={handleDetect}
              >
                Generate voice message
              </button>
              <span
                className={`${
                  loading ? "" : "hidden"
                } ml-40 mt-6 text-[15px] text-slate-700`}
              >
                {loading ? "(Running NN model...)" : ""}
              </span>
            </div>
            {/*  Play the voice message if processedVoice file is defined */}
            {processedVoice && (
              <audio
                className="ml-20 mt-20"
                controls
                src={URL.createObjectURL(processedVoice)}
              />
            )}
          </div>
          <div className="z-10 h-96 w-96 self-center">
            <Logo fov={15} file='nothing' />
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Delivery;
