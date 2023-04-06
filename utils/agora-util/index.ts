import {
  ClientConfig,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

export const config: any = {
  mode: "rtc",
  codec: `vp8`,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  token: process.env.NEXT_PUBLIC_TOKEN as string,
};
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
