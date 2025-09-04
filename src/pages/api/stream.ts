import type { APIRoute } from "astro";
import ChatController from "../../controllers/chat";

export const GET: APIRoute = async ({ request }) => {
  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;
      let heartbeatInterval: NodeJS.Timeout | null = null;

      // Function to safely close the connection
      const safeClose = () => {
        if (isClosed) return;
        isClosed = true;
        
        // Clear heartbeat interval first
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        
        // Unsubscribe from new messages
        ChatController.getInstance().unsubscribe(sendEvent);
        
        // Close controller
        try {
          controller.close();
        } catch (error) {
          console.error("Error closing controller:", error);
        }
      };

      // Add heartbeat interval to keep connection alive
      heartbeatInterval = setInterval(() => {
        // Double-check if closed before attempting to send
        if (isClosed || !controller) {
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }
          return;
        }
        
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch (error) {
          console.error("Error sending heartbeat:", error);
          safeClose();
        }
      }, 15000); // Send heartbeat every 15 seconds

      const sendEvent = (data: any) => {
        // Check if already closed
        if (isClosed || !controller) return;

        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error("Error sending event:", error);
          safeClose();
        }
      };

      // Subscribe to new messages
      ChatController.getInstance().subscribe(sendEvent);

      // Handle client disconnect
      request.signal.addEventListener("abort", safeClose);
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
