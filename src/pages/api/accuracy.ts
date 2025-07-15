import type { APIRoute } from "astro";
import Markov from "../../ts/markov";
import graphsData from "../../data/graphs.json";
import { descriptions, authors } from "../../ts/vars";

export const GET: APIRoute = async () => {
  // Prepare training data: graph captions + descriptions
  const captions = graphsData.map((g) => g.caption);
  const trainingData = [...captions, ...descriptions, ...authors];

  // Initialize and load Markov model
  const markov = new Markov();
  await markov.load(trainingData);

  // Generate 1000 lines of babble, each max 1000 words
  const lines: string[] = [];
  for (let i = 0; i < 1000; i++) {
    lines.push(markov.generate(500));
  }

  // Return as plain text
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
