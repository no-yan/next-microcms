import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: "noyan",
  apiKey: process.env.API_KEY,
});
