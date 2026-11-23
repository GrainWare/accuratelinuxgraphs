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

  const match = (graphsData as Array<{ filename: string }>).find(
    (item) => item.filename === filename,
  );

  if (match) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/assets/graphs/" + match.filename,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const fileName = filename.replace(/\.[^/.]+$/, "");
  const graphsNewKey = graphsData.map((item) => ({
    ...item,
    searchName:
      item.filename
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "",
  }));

  const fuse = new Fuse(graphsNewKey, {
    keys: ["searchName"],
    includeScore: true,
  });

  const fuzzyResults = fuse.search(fileName);

  if (fuzzyResults.length > 0) {
    const matchedImage = fuzzyResults[0].item as {
      filename: string;
    };
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/assets/graphs/" + matchedImage.filename,
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
