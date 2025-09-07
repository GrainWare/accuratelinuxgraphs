import "astro";
import type { APIRoute } from "astro";
import graphsData from "../../../data/graphs.json";
import Fuse from "fuse.js";

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

  const fileName = filename.replace(/\.[^/.]+$/, "");
  const graphsNewKey = graphsData.map((item) => ({
    ...item,
    filename:
      item.graphImgUrl
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "",
  }));

  const fuse = new Fuse(graphsNewKey, {
    keys: ["filename"],
    includeScore: true,
  });

  const fuzzyResults = fuse.search(fileName);

  if (fuzzyResults.length > 0) {
    const matchedImage = fuzzyResults[0].item as {
      graphImgUrl: string;
      filename: string;
    };
    return new Response(null, {
      status: 302,
      headers: {
        Location: matchedImage.graphImgUrl,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/assets/img/404.png",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
