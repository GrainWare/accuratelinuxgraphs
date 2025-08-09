import "astro";
import type { APIRoute } from "astro";
import graphsData from "../../../data/graphs.json";

export const GET: APIRoute = ({ params }) => {
  // get ID param from the URL
  const { id } = params;

  // check if the index (ID) is valid
  if (graphsData[id] != undefined) {
    return new Response(JSON.stringify(graphsData[id]), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    return new Response(
      JSON.stringify({ error: `inaccurate graph index '${id}'` }),
    );
  }
};
