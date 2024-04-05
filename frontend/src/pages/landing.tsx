import React, { useCallback, useEffect } from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import axios from "axios";
import Image from "next/image";
import Webcam from "react-webcam";

import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/router";

function Landing() {
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

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [webcamImage, setWebcamImage] = React.useState<File | null>(null);
  const [processedImage, setProcessedImage] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [landingImageID, setLandingImageID] = React.useState(createId());

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const webcamRef = React.useRef<any>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to Blob
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "webcam-screenshot.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file); // or another state variable
          });
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    const handleDetect = async () => {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      try {
        const response = await axios.post(
          `http://172.174.255.171:5003/upload?landing_image_id=${landingImageID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProcessedImage(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to upload the file");
      } finally {
        setLoading(false); // Set loading state back to false
      }
    };

    // Call handleDetect whenever landingImageID changes
    if (selectedFile && landingImageID) {
      handleDetect();
    }
  }, [landingImageID]);

  const onDetectClick = async () => {
    if (selectedFile) {
      await setLandingImageID(createId());
    } else {
      alert("Please select an image to process");
    }
  };

  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  return (
    <Layout>
      <main className="grow">
        <div>
          <div className="ml-40 mt-6">
            <div className="m-0 text-[17px] font-bold text-white">
              Inspection
            </div>
            <div className="mb-5 mt-[10px] text-[15px] leading-normal text-slate-700">
              Inspect workpiece and detect defects
            </div>
          </div>
          <div className="mx-10 flex flex-col items-center justify-around p-6 md:flex-row">
            <div className="max-h-sm max-w-sm border-2 border-slate-800">
              {selectedFile ? (
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={450}
                  height={300}
                  className="h-80 w-full object-cover"
                />
              ) : webcamImage ? (
                <Image
                  src={URL.createObjectURL(webcamImage)}
                  alt="Preview"
                  width={450}
                  height={300}
                  className="h-80 w-full object-cover"
                />
              ) : (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    ...videoConstraints,
                    facingMode: FACING_MODE_ENVIRONMENT,
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={inputFileRef}
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] || null);
                }}
              />
            </div>
            <div className="flex flex-col justify-center gap-6 p-6">
              <button
                className="btn group bg-gradient-to-t from-blackA11 to-blackA9 text-white shadow-lg hover:to-gray-800"
                onClick={() => inputFileRef.current?.click()}
              >
                Upload File (jpg)
              </button>
              <button
                className="btn group bg-gradient-to-t from-blackA11 to-blackA9 text-white shadow-lg hover:to-gray-800"
                onClick={() => {
                  if (selectedFile) {
                    setSelectedFile(null);
                  } else {
                    if (webcamImage) {
                      setWebcamImage(null);
                    } else {
                      capture();
                    }
                  }
                }}
              >
                {selectedFile
                  ? `Back to WebCam`
                  : webcamImage
                  ? `Retake`
                  : `Capture Image`}
              </button>
              <button
                type="button"
                className={`btn group text-white shadow-lg ${
                  selectedFile || webcamImage
                    ? "bg-green-800 hover:bg-green-700"
                    : "bg-gray-300"
                }  focus:ring-green-800`}
                onClick={async () => {
                  if (selectedFile) {
                    onDetectClick();
                  } else {
                    alert("Please select an image to process");
                  }
                }}
              >
                Detect
              </button>
              {/*<button*/}
              {/*  onClick={() => {*/}
              {/*    window.location.href = `/delivery?dish=${routeFood}&user=${routeUser}&orderID=${routeOrderID}&city=${routeCity}`;*/}
              {/*  }}*/}
              {/*  className="btn group bg-gradient-to-t from-orange-800 to-orange-700 text-white shadow-lg hover:to-orange-500"*/}
              {/*>*/}
              {/*  N*/}
              {/*  <span className="ml-1 tracking-normal text-orange-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">*/}
              {/*    -&gt;*/}
              {/*  </span>*/}
              {/*</button>*/}
            </div>
            <div className="max-h-sm max-w-sm border-2 border-slate-800">
              {loading ? (
                <div className="flex h-72 w-96 items-center justify-center text-gray-800">
                  <div>Loading...</div>
                </div>
              ) : processedImage ? (
                <Image
                  src={`https://tooldetectivestorageacc.blob.core.windows.net/intel-hackathon/landing_image/${landingImageID}.jpg?${process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN}`}
                  alt="Preview"
                  width={450}
                  height={300}
                  className="h-80 w-full object-cover"
                />
              ) : (
                <div className="flex h-72 w-96 items-center justify-center text-gray-800">
                  <div>Select an image to process</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Landing;
