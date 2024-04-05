import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import type { MapRef } from "react-map-gl";
import { Marker, Popup } from "react-map-gl";
import Map from "react-map-gl";
import Logo from "~/components/3dLogo";
import { useRouter } from "next/router";
import { CITIES } from "~/components/manufacturingSites";
import { Pin } from "@mui/icons-material";
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
          zoom: 2,
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

  const [popupInfo, setPopupInfo] = useState<{
    city: string | null;
    country: string | null;
    longitude: number | null;
    latitude: number | null;
    image: string;
  } | null>(null);

  console.log(popupInfo);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <Layout>
      <main className="grow select-none">
        <div className="flex items-center justify-center">
          <div className="ml-20 flex h-[75vh] basis-1/2 flex-col justify-start">
            <div className="m-0 mt-6 text-[17px] font-bold text-white">
              Manufacturing Sites
            </div>
            {/* Show info about the client location and order */}
            <div className="flex flex-col">
              {city && (
                <div className="flex">
                  <span className="text-[15px] text-slate-700">
                    Your location:&nbsp;
                  </span>
                  <span className="text-[15px] text-slate-700">{city}</span>
                </div>
              )}
              {lat && lon && (
                <div className="flex">
                  <span className="text-[15px] text-slate-700">
                    Your coordinates:&nbsp;
                  </span>
                  <span className="text-[15px] text-slate-700">
                    {lat}, {lon}
                  </span>
                </div>
              )}
              <button
                className="btn group z-20 mx-20 mt-6 bg-gradient-to-t from-blackA11 to-blackA9 text-white shadow-lg hover:to-gray-800"
                type="button"
                onClick={handleDetect}
              >
                Closest Manufacturing Site
              </button>
              <div className="z-10 -mt-8 h-96 w-full self-center">
                <Logo fov={60} file={"a320"} />
              </div>
              <span
                className={`${
                  loading ? "" : "hidden"
                } -mt-20 ml-20 text-[15px] text-slate-700`}
              >
                (Finding closest Manufacturing site based on your location...)
              </span>
              <span
                className={`${
                  loading ? "hidden" : ""
                } -mt-20 ml-20 text-[15px] text-slate-700`}
              ></span>
              {/*<button*/}
              {/*  onClick={() => {*/}
              {/*    window.location.href = `/flying?dish=${routeFood}&user=${routeUser}&orderID=${routeOrderID}&city=${city}`;*/}
              {/*  }}*/}
              {/*  className="btn group z-20 mx-20 mt-6 bg-gradient-to-t from-orange-800 to-orange-700 text-white shadow-lg hover:to-orange-500"*/}
              {/*>*/}
              {/*  Start delivery*/}
              {/*  <span className="ml-1 tracking-normal text-orange-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">*/}
              {/*    -&gt;*/}
              {/*  </span>*/}
              {/*</button>*/}
            </div>
          </div>
          <div className="h-[75vh] w-full basis-1/2">
            <Map
              ref={mapRef}
              initialViewState={{
                latitude: 0,
                longitude: 0,
                zoom: 1,
                bearing: 0,
                pitch: 0,
              }}
              mapStyle={"mapbox://styles/mapbox/dark-v10"}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            >
              {pins}
              {/*<Popup*/}
              {/*  anchor="top"*/}
              {/*  longitude={Number(popupInfo.longitude)}*/}
              {/*  latitude={Number(popupInfo.latitude)}*/}
              {/*  onClose={() => setPopupInfo(null)}*/}
              {/*  className="w-28"*/}
              {/*>*/}
              {/*  <div key={`img`}>*/}
              {/*    <Image*/}
              {/*      src={popupInfo.image}*/}
              {/*      alt=""*/}
              {/*      width={100}*/}
              {/*      height={100}*/}
              {/*      className="rounded-lg"*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</Popup>*/}
            </Map>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Manufacturing;
