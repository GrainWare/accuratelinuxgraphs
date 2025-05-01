import type { APIRoute } from "astro";
import ChatController from "../../controllers/chat";

export const GET: APIRoute = async ({ request }) => {
  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;

      // Add heartbeat interval to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch (error) {
            console.error("Error sending heartbeat:", error);
            clearInterval(heartbeatInterval);
            isClosed = true;
          }
        }
      }, 15000); // Send heartbeat every 15 seconds

      const sendEvent = (data: any) => {
        // Double protection: check flag and try-catch the operation
        if (isClosed) return;

        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          // If we somehow reach here with a closed controller, mark as closed
          console.error("Error sending event:", error);
          isClosed = true;
        }
      };

      // Subscribe to new messages
      ChatController.getInstance().subscribe(sendEvent);

      request.signal.addEventListener("abort", () => {
        // Mark as closed first
        isClosed = true;
        // Clear the heartbeat interval
        clearInterval(heartbeatInterval);
        // Unsubscribe from new messages - doing this synchronously
        ChatController.getInstance().unsubscribe(sendEvent);

        try {
          controller.close();
        } catch (error) {
          console.error("Error closing controller:", error);
        }
      });
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
    },
  });
};
