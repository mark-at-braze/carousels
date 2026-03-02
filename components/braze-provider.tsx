"use client";
import { useEffect } from "react";
import { initBraze } from "@/lib/braze";

export default function BrazeProvider() {
  useEffect(() => {
    initBraze();
  }, []);

  return null;
}