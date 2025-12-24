/**
 * Highlights OTP patterns in text
 * Detects sequences of 4-8 digits and wraps them with HTML markup
 */
export const highlightOTP = (text: string): string => {
  // Pattern to match 4-8 consecutive digits
  const otpPattern = /\b\d{4,8}\b/g;

  return text.replace(
    otpPattern,
    (match) =>
      `<span class="inline-flex items-center gap-1.5 font-mono font-bold text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 px-2.5 py-1 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-sm">${match}</span>`
  );
};

/**
 * Extracts potential OTP values from text
 */
export const extractOTP = (text: string): string[] => {
  const otpPattern = /\b\d{4,8}\b/g;
  const matches = text.match(otpPattern);
  return matches || [];
};

/**
 * Checks if text contains an OTP
 */
export const hasOTP = (text: string): boolean => {
  const otpPattern = /\b\d{4,8}\b/;
  return otpPattern.test(text);
};
