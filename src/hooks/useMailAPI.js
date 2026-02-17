import { useState } from "react";

const useMailAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * mail-api.php expects:
   * headers: Content-Type: application/json, X-API-Key
   * body: { name, email, subject, message, captchaToken }
   */
  const sendEmail = async ({ name, email, subject, message, captchaToken }) => {
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_MAIL_API_URL;
    const apiKey = import.meta.env.VITE_MAIL_API_KEY;

    try {
      if (!apiUrl) throw new Error("Mail API URL is missing (VITE_MAIL_API_URL).");
      if (!apiKey) throw new Error("Mail API key is missing (VITE_MAIL_API_KEY).");
      if (!captchaToken) throw new Error("Captcha token missing. Please verify captcha.");

      const payload = {
        name: name ?? "",
        email: email ?? "",
        subject: subject ?? "",
        message: message ?? "",
        captchaToken,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey, // ✅ matches PHP: HTTP_X_API_KEY
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        result = { error: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        throw new Error(result?.error || result?.message || `HTTP ${response.status}`);
      }

      // ✅ new backend returns { ok: true, message: "..." }
      if (!result || result.ok !== true) {
        throw new Error(result?.error || result?.message || "Failed to send email.");
      }

      return result;
    } catch (err) {
      const msg = err?.message || "Something went wrong while sending the message.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};

export default useMailAPI;
