import axios from "axios";
import React, { useEffect, useRef } from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import type { MapRef } from "react-map-gl";
import Map from "react-map-gl";
import Logo from "~/components/3dLogo";
import { useRouter } from "next/router";
import Image from "next/image";

function Manufacturing() {
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

  const [city, setCity] = React.useState("");
  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const mapRef = useRef<MapRef | null>(null);

  const fetchLocation = async () => {
    const apiURL = "https://ipgeolocation.abstractapi.com/v1/";
    const apiKey = process.env.NEXT_PUBLIC_ABSTRACT_TOKEN;

    try {
      const response = await axios.get(apiURL, {
        params: { api_key: apiKey },
      });
      if (response.data.city) {
        setCity(response.data.city);
        setLat(response.data.latitude);
        setLon(response.data.longitude);
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

  useEffect(() => {
    const fetchDataAndFly = async () => {
      await fetchLocation();
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: [lon, lat],
          zoom: 11,
          duration: 2000,
        });
      }, 0);
    };

    fetchDataAndFly();
  }, [city]);

  const handleDetect = async () => {
    setLoading(true);

    const DATA = {
      keras_saved_model_dir:
        "./store/models/feat_logistics_demand_forecasting/model.pb",
      output_saved_dir:
        "./store/models/feat_logistics_demand_forecasting/model.pb",
      input_file: "./store/datasets/feat_logistics_demand_forecasting/test.csv",
      results_save_dir: "./store/outputs/feat_logistics_demand_forecasting/",
      window: "demand forecaster window",
      lag_size: "demand forecaster lag window",
      batch_size: "demand forecaster batch",
      num_iters: "demand forecaster iterations",
    };

    try {
      const response = await axios.post(`http://localhost:5001/predict`, DATA);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed running endpoint");
    }
  };

  return (
    <Layout>
      <main className="relative grow">
        <div className="flex items-center justify-center">
          {/* Show info about the client location and order */}
          <div className="z-10 -mt-8 h-96 w-full self-center">
            <Logo fov={15} file={"airplane_engine"} />
          </div>
        </div>
        <div className="absolute top-0 -z-10 -mt-24 h-[100vh] w-[100vw] opacity-50">
          <Image
            src={`/backgrounds/project-ar.png`}
            alt="background"
            className="object-cover"
            layout="fill"
            quality={100}
          />
        </div>
      </main>
    </Layout>
  );
}

export default Manufacturing;
