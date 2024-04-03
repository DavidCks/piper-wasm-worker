/**
 * Generates a short hash of the input string using the SHA-256 algorithm. This function
 * returns the first 8 characters of the hash, trading some degree of uniqueness for brevity.
 * It's designed to operate in a browser environment and uses the SubtleCrypto API.
 *
 * Note: Shortening the hash increases the potential for collisions, especially as the range
 * of inputs grows. This method should be used when a short identifier is required and
 * absolute uniqueness is not critical, or when the range of inputs is relatively small and controlled.
 *
 * @async
 * @param {string} input - The input string to hash.
 * @returns {Promise<string>} A promise that resolves to an 8-character hexadecimal string representing
 *                            a portion of the SHA-256 hash of the input. The promise is rejected if the
 *                            hashing operation fails.
 *
 * @example
 * generateShortHash('Example input string').then((hash) => console.log(hash));
 * // Output might be something like 'a1b2c3d4'
 */
export async function generateShortHash(input: string): Promise<string> {
  // Encode input string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Hash the input using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to byte array
  const byteArray = new Uint8Array(hashBuffer);

  // Convert byte array to hexadecimal string
  let hexString = "";
  byteArray.forEach((byte) => {
    hexString += byte.toString(16).padStart(2, "0");
  });

  // Return a portion of the hash for brevity. Here we're taking the first 8 characters.
  // This reduces uniqueness but increases the likelihood of fitting the hash into restrictions.
  return hexString.substring(0, 8);
}
