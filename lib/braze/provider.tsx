"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initBraze, braze } from "./init";
import type { Banner } from "@braze/web-sdk";

export const CAROUSEL_PLACEMENT_IDS = [
  "carousel_slot_1",
  "carousel_slot_2",
  "carousel_slot_3",
  "carousel_slot_4",
];

interface BrazeContextValue {
  banners: Record<string, Banner | null>;
}

const BrazeContext = createContext<BrazeContextValue>({ banners: {} });

export function useBrazeContext() {
  return useContext(BrazeContext);
}

export default function BrazeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banners, setBanners] = useState<Record<string, Banner | null>>({});

  useEffect(() => {
    initBraze();

    const subscriptionId = braze.subscribeToBannersUpdates((updatedBanners) => {
      setBanners({ ...updatedBanners });
    });

    braze.requestBannersRefresh(CAROUSEL_PLACEMENT_IDS);

    return () => {
      if (subscriptionId) {
        braze.removeSubscription(subscriptionId);
      }
    };
  }, []);

  return (
    <BrazeContext.Provider value={{ banners }}>
      {children}
    </BrazeContext.Provider>
  );
}
