import "server-only"

import { envClient } from "@/data/env/client";
import { envServer } from "@/data/env/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamVideo = new StreamClient(
  envClient.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  envServer.STREAM_VIDEO_SECRET_KEY,
);
