import { createClient } from "@sanity/client";
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: "7iurmi0g",
  dataset: "production",
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2023-05-03", // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getMonthPricing(month: string, weekday: string) {
  const response = await client.fetch(
    `*[_type == 'monthpricing' && month == '${month}']{
        "prices": ${weekday}.prices
    }`
  );
  if (response.length === 0) return null;

  return response[0].prices;
}
