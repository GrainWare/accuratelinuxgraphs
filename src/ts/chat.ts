// needs to be 3 words maximum, only words allowed are "accurate", "linux", "graphs"
export function isValidMessage(message: string): boolean {
  const words = message.split(" ");
  if (words.length > 3) {
    return false;
  }
  const validWords = [
    "accurate",
    "linux",
    "graphs",
    "accuracy",
    "accuratelinuxgraphs",
    "hi",
  ];
  for (const word of words) {
    if (!validWords.includes(word)) {
      return false;
    }
  }
  return true;
}
