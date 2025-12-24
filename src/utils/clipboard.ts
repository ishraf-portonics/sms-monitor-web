/**
 * Copy text to clipboard
 * Returns a promise that resolves if successful
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

/**
 * Show a temporary toast notification (can be integrated with a toast library later)
 */
export const showCopyNotification = (
  message: string = "Copied to clipboard!"
) => {
  // This can be enhanced with a proper toast notification library
  console.log(message);
};
