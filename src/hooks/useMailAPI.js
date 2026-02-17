import { useState } from "react";

const useMailAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends a "contact" message to the server.
   * Backend forces delivery to MAIL_TO (admin inbox) to prevent open relay.
   *
   * Expected by backend:
   * - headers: Content-Type: application/json, X-API-KEY
   * - body: { action, subject, message, reply_to, reply_to_name }
   */
  const sendEmail = async ({
    from, // (kept for backward compatibility; used as reply_to)
    subject,
    message,
    name, // sender name (optional)
    // to, attachments ignored intentionally (backend disables these)
  }) => {
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_MAIL_API_URL;
    const apiKey = import.meta.env.VITE_MAIL_API_KEY;

    try {
      if (!apiUrl) {
        throw new Error("Mail API URL is missing (VITE_MAIL_API_URL).");
      }
      if (!apiKey) {
        throw new Error("Mail API key is missing (VITE_MAIL_API_KEY).");
      }

      // Build payload exactly as mail-api.php expects
      const payload = {
        action: "contact",
        subject: subject ?? "",
        message: message ?? "",
        reply_to: from ?? "", // use 'from' as reply_to (user email)
        reply_to_name: name ?? "",
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify(payload),
      });

      // Read text first to avoid JSON parse crashes on HTML/empty responses
      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        result = { status: "error", message: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        throw new Error(result?.message || `HTTP ${response.status}`);
      }

      if (!result || result.status !== "success") {
        throw new Error(result?.message || "Failed to send email.");
      }

      return result;
    } catch (err) {
      const msg =
        err?.message || "Something went wrong while sending the message.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};

export default useMailAPI;
