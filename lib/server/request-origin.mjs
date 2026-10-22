/** Allow localhost and the one explicitly configured HTTPS preview origin.
 * @param {Headers} headers
 * @param {boolean} requireOrigin
 * @param {string | undefined} previewOrigin
 */
export function sameOriginRequest(
  headers,
  requireOrigin = true,
  previewOrigin = process.env.SAAVANTUS_PREVIEW_ORIGIN,
) {
  const host = headers.get("host");
  let expected = ["127.0.0.1:3100", "localhost:3100"].includes(host ?? "")
    ? `http://${host}`
    : null;
  if (!expected && previewOrigin) {
    try {
      const preview = new URL(previewOrigin);
      if (
        preview.protocol === "https:" &&
        preview.origin === previewOrigin &&
        !preview.username &&
        !preview.password &&
        preview.host === host
      ) expected = previewOrigin;
    } catch { /* Invalid configuration grants no access. */ }
  }
  if (!expected) return false;
  const origin = headers.get("origin");
  return origin === expected || (!requireOrigin && !origin);
}
