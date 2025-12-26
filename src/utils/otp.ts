/**
 * Highlights OTP patterns in text
 * Detects sequences of 4-8 digits and wraps them with HTML markup
 */
export const highlightOTP = (text: string): string => {
  // Pattern to match 4-8 consecutive digits
  const otpPattern = /\b\d{4,8}\b/g;

  return text.replace(
    otpPattern,
    (match) => `<span class="otp-highlight">${match}</span>`
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
