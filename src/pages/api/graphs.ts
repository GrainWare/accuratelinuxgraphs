import type { APIRoute } from "astro";
import graphsData from "../../data/graphs.json";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(graphsData), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};