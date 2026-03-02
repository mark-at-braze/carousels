import * as braze from "@braze/web-sdk";

export function initBraze() {
  braze.initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY!, {
    baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT!,
    enableLogging: true,
  });
  braze.openSession();
}

export { braze };
