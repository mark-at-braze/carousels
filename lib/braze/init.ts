import * as braze from "@braze/web-sdk";

let initialized = false;

export function initBraze() {
  if (initialized || typeof window === "undefined") return;
  braze.initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY!, {
    baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT!,
    enableLogging: true,
    allowUserSuppliedJavascript: true, // required for Banner HTML
  });
  braze.openSession();
  initialized = true;
}

export { braze };
