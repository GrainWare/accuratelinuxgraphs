import "astro";
import type { APIRoute } from "astro";
import graphsData from "../../../data/graphs.json";

export const GET: APIRoute = ({ params }) => {
  const { filename } = params;
  if (!filename) {
    return new Response(
      JSON.stringify({ error: "missing filename parameter" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  const match = (graphsData as Array<{ graphImgUrl: string }>).find(
    (item) => item.graphImgUrl.split("/").pop() === filename,
  );

  if (match) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: match.graphImgUrl,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return new Response(
    JSON.stringify({ error: `inaccurate graph filename '${filename}'` }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
