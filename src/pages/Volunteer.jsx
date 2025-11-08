import React from "react";
import { motion } from "framer-motion";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
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
            🙏 Jai Sri Ram! Welcome to Sri Bhaktha Hanuman Temple Volunteer 🙏
          </h1>

          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              We are grateful for your willingness to be part of our temple seva
              journey. To get to know you better and plan seva activities,
              please share a short self-introduction (Name, Area, Any Seva
              Interest).
            </p>
            <p className="text-xl font-semibold text-orange-700 mb-2">
              Your Time & Effort = Temple's Strength!
            </p>
            <p className="text-gray-600">
              Together, we can make every event successful and meaningful.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Google Form Embed */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-1 md:p-2">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSca3syOo6CMU6Bg9qC-qSB6Gs7dITVw2MrEdzcKV9wdbMzApQ/viewform?usp=dialog"
                width="100%"
                height="1500"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="rounded-lg"
              >
                Loading…
              </iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
