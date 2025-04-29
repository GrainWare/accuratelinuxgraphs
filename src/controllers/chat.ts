import EventEmitter from "events";
import { isValidMessage } from "../ts/chat";

export default class ChatController {
  private static instance: ChatController;
  private constructor() {}

  static getInstance(): ChatController {
    if (!ChatController.instance) {
      ChatController.instance = new ChatController();
    }
    return ChatController.instance;
  }
  private messages: string[] = [];
  private closedCallbacks: Set<Function> = new Set(); // Track which callbacks are from closed connections

  public getMessages(): string[] {
    return this.messages;
  }
  private emitter = new EventEmitter();

  public subscribe(callback: (message: string) => void): void {
    this.emitter.on("message", callback);
  }

  public unsubscribe(callback: (message: string) => void): void {
    // Mark this callback as coming from a closed connection
    this.closedCallbacks.add(callback);
    this.emitter.off("message", callback);
  }

  public addMessage(message: string): void {
    if (!isValidMessage(message)) {
      message =
        "SYS: Messages are limited to 3 words and only the words 'accurate', 'linux', and 'graphs' are allowed. Also a few more, have fun finding them!";
    }
    this.messages.push(message);

    // Get all listeners BEFORE emitting to avoid race conditions
    const listeners = this.emitter.listeners("message");

    // Only emit to listeners that aren't closed
    for (const listener of listeners) {
      if (!this.closedCallbacks.has(listener)) {
        try {
          listener(message);
        } catch (err) {
          console.error("Error in message listener:", err);
        }
      }
    }

    // remove messages older than 5 so it doesn't get too long
    if (this.messages.length > 5) {
      this.messages.shift();
    }
  }
}
