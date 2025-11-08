import React from "react";
// Assuming you will copy Card, CardContent, CardHeader, CardTitle to your components/ui folder
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Leaf, Music, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder Shadcn components for local setup
const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);
const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      {/* Header Section */}
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      <section className="relative py-20 px-4 overflow-hidden bg-orange-50/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <img
              src="/assets/Logo.png" // Local image path
              alt="Sri Bhaktha Hanuman Temple Logo"
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            About Sri Bhaktha Hanuman Temple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A sacred sanctuary dedicated to Lord Hanuman, serving the Greater
            Indiana community with devotion and dedication.
          </p>
        </motion.div>
      </section>

      {/* Our Journey Section */}
      <section className="py-16 px-4 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Our Journey
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  With devotees' prayers, Sri Bhaktha Hanuman Temple is
                  established in Indiana to bring Hanuman and all other Gods to
                  serve the Greater Indiana community with devotion and
                  dedication.
                </p>
                <p>
                  Our temple is a sacred space where devotees come together,
                  seek solace, and find spiritual nourishment through
                  traditional practices and community fellowship.
                </p>
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg mt-6">
                  <p className="text-xl font-semibold text-center text-orange-800">
                    🙏 Jai Sriram. Jai Bajrangbali 🙏
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/assets/Logo.png" // Local image path
                  alt="Temple Logo"
                  className="w-full h-96 object-contain bg-gradient-to-br from-orange-50 to-yellow-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values & Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Committed to preserving traditions, nurturing harmony, and serving
              our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Embracing Tradition */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Embracing Tradition Every Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    At Sri Bhaktha Hanuman Temple, we are committed to
                    preserving and promoting the rich traditions of Hindu
                    culture. Our daily rituals and practices are a testament to
                    our dedication to upholding the values and customs that have
                    been passed down through generations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spiritual Harmony */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Nurturing Spiritual Harmony
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    We take our responsibility towards the environment
                    seriously. Our temple is dedicated to sustainable practices,
                    ensuring that our activities and events are in harmony with
                    nature. We strive to create a nurturing and eco-friendly
                    environment for our devotees and future generations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preserving Culture */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Preserving Culture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Sri Bhaktha Hanuman Temple takes pride in supporting Hindu
                    Culture and local artists - who perform Indian dances,
                    Vocal, Musicians will be supported and performances will be
                    conducted as an offering to God.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience the Divine Section */}
      <section className="py-16 px-4 bg-yellow-50/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/assets/sacred.png" // Local image path
                  alt="Sacred Hanuman Chalisa illustration"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-semibold">
                    Sacred Space for Prayer and Meditation
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Experience the Divine!
                </h2>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Immerse yourself in the divine energy and find inner peace at
                Sri Bhaktha Hanuman Temple. Join us for our special events and
                ceremonies to experience the spiritual essence of our sacred
                space.
              </p>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Visit Us
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Address:</strong> 10080 E 121st Street, Suite 130A,
                    Fishers IN 46037
                  </p>
                  <p>
                    <strong>Phone:</strong> 248-525-8917
                  </p>
                  <div className="mt-4">
                    <p>
                      <strong>Temple Hours:</strong>
                    </p>
                    <p>Weekdays: 09:00 AM - 11:30 AM, 6:00 PM - 8:30 PM</p>
                    <p>Weekends: 08:30 AM - 02:30 PM, 5:30 PM - 8:30 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
