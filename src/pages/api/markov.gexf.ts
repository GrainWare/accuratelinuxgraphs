import type { APIRoute } from "astro";
import Markov from "../../ts/markov";
import graphsData from "../../data/graphs.json";
import { descriptions, authors } from "../../ts/vars";

export const GET: APIRoute = async () => {
  const captions = graphsData.map((g) => g.caption);
  const trainingData = [...captions, ...descriptions, ...authors];
  const markov = new Markov();
  await markov.load(trainingData);
  const gexf = markov.toGEXF();
  return new Response(gexf, {
    headers: { "Content-Type": "application/gexf+xml; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
};
