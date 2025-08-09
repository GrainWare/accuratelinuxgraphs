import type { APIRoute } from "astro";
import graphsData from "../../../data/graphs.json";

export const GET: APIRoute = () => {
  const randomGraph = graphsData[Math.floor(Math.random() * graphsData.length)];
  return new Response(JSON.stringify(randomGraph), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
