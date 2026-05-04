"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_ID ?? "wlvx0isghh";

export default function MicrosoftClarity() {
  useEffect(() => {
    if (!clarityProjectId) return;

    Clarity.init(clarityProjectId);
  }, []);

  return null;
}