import React from "react";
import "aos/dist/aos.css";
import Layout from "../components/layout/Layout";
import { api } from "~/utils/api";
import { format } from "date-fns";

function Orders() {
  const queryOrders = api.order.read.useQuery({});

  return (
    <Layout>
      <main className="grow">
        <div className="mx-40">
          {queryOrders.data?.map((order) => (
            <li
              key={order.order_id}
              className="border-b border-slate-200 last:border-0"
            >
              <div className="block rounded-lg bg-[#3f3f3f] px-4 py-2 hover:bg-slate-500">
                <div>
                  <div className="grid grid-cols-6 grid-rows-1 ">
                    <span className="font-medium text-slate-200">
                      📣
                    </span>
                    <span className="font-medium col-span-3 text-slate-200">
                      Asked: {order.order_ask}
                    </span>
                    <span className="font-medium text-slate-200">
                      from {order.order_city}
                    </span>
                    <span className="mb-2 block text-sm text-slate-200">
                      Rating: {order.order_rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-xs font-medium text-slate-200">
                      {format(order.order_created_at, "d MMM - (HH:mm:ss)")}
                    </span>
                    <span className="block text-xs font-medium text-slate-200">
                      {order.order_review}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default Orders;
