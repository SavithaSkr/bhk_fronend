import { useState } from 'react';

const useMailAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async ({ from, to, subject, message, attachments = [] }) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add email data
      formData.append('from_email', from);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('message', message);
      
      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await fetch(import.meta.env.VITE_MAIL_API_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(result.message);
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};

export default useMailAPI;