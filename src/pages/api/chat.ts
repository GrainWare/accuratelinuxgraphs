import type { APIRoute } from "astro";
import ChatController from "../../controllers/chat";

export const POST: APIRoute = async ({ request }) => {
  const { message } = await request.json();
  ChatController.getInstance().addMessage(message);
  return new Response(null, { status: 204 });
};
