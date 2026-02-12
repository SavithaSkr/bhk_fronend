import React from "react";
import { motion } from "framer-motion";

export default function PriestBookingPage() {
  const JOT_FORM_ID = import.meta.env.VITE_JOT_FORM_ID;

  // Build URL from env (and fail safely if missing)
  const jotformUrl = JOT_FORM_ID ? `https://form.jotform.com/${JOT_FORM_ID}` : null;

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* ... your existing header / decorations ... */}

      {/* Jotform Embed */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-1 md:p-2">
              {jotformUrl ? (
                <iframe
                  src={jotformUrl}
                  width="100%"
                  height="1500"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  className="rounded-lg"
                  title="Priest Booking Form"
                >
                  Loading…
                </iframe>
              ) : (
                <div className="p-6 text-center text-red-700">
                  JotForm is not configured. Missing <b>VITE_JOT_FORM_ID</b>.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
