import React from "react";
import { motion } from "framer-motion";
import JotFormEmbed from "../components/JotFormEmbed.jsx";

export default function PriestBookingPage() {
  const JOT_FORM_ID = import.meta.env.VITE_JOT_FORM_ID;
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      {/* Welcome Header */}
      <section className="bg-orange-50/95 backdrop-blur-sm py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🙏 Jai Sri Ram! Priest Booking Service 🙏
          </h1>

          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Book our experienced priests for special ceremonies, home pujas,
              and religious events. Please fill out the form below with your
              requirements and preferred timing.
            </p>
            <p className="text-xl font-semibold text-orange-700 mb-2">
              Sacred Ceremonies = Divine Blessings!
            </p>
            <p className="text-gray-600">
              Our temple coordinator will contact you soon to confirm your
              priest booking details.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Jotform Embed */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-1 md:p-2">
              {/* <iframe
                src="https://form.jotform.com/252574598483069"
                width="100%"
                height="1500"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="rounded-lg"
                title="Priest Booking Form"
              >
                Loading…
              </iframe> */}
              <JotFormEmbed formId={JOT_FORM_ID} formUrl={`https://form.jotform.com/${JOT_FORM_ID}`} height="700px" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
