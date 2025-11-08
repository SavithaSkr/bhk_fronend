import React, { useState, useEffect } from "react";
import { DonationCart } from "../services/entities.js"; // Updated import path
// Assuming you will copy Button to your components/ui folder
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import DonationCategoryCard from "../components/donations/DonationCategoryCard.jsx"; // Updated import path
import DonationForm from "../components/donations/DonationForm.jsx"; // Updated import path
import DonationCartComponent from "../components/donations/DonationCart.jsx"; // Updated import path

// Placeholder Shadcn components for local setup
const Button = ({ children, className, onClick }) => (
  <button
    className={`px-4 py-2 rounded-md bg-blue-500 text-white ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const DONATION_CATEGORIES = [
  {
    name: "General Donation",
    description: "Support temple operations and maintenance",
  },
  {
    name: "Pooja Sponsorship",
    description: "Sponsor daily pujas and special ceremonies",
  },
  { name: "Neivethiyam", description: "Provide prasadam for devotees" },
  { name: "Annadhanam", description: "Support free meal programs" },
  { name: "Flower", description: "Daily flower offerings for deities" },
  {
    name: "Vashtram / Cloth Donation",
    description: "Clothing and fabric for deities",
  },
  {
    name: "Aabharanam / Abhushanam",
    description: "Jewelry and ornaments for deities",
  },
];

// Helper function to create page URLs (as per outline) - already in createPageUrl.js
// const createPageUrl = (pageName) => { /* ... */ };

export default function DonationsPage() {
  const [currentStep, setCurrentStep] = useState("categories"); // 'categories', 'form', 'cart', 'success'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "USA",
    zip_code: "",
  });

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Generate session ID for local cart management (not saved to DB in this local version)
    const session = Math.random().toString(36).substr(2, 9);
    setSessionId(session);

    // In a local setup, cart items are kept in session storage or state for simplicity
    const savedCart = sessionStorage.getItem(`donation_cart_${session}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to session storage whenever it changes
    if (sessionId) {
      sessionStorage.setItem(
        `donation_cart_${sessionId}`,
        JSON.stringify(cartItems)
      );
    }
  }, [cartItems, sessionId]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep("form");
  };

  const handleAddToCart = async (cartItem) => {
    try {
      // In local setup, cart items are stored in state and session storage.
      // If we wanted to persist them to MongoDB, we'd use DonationCart.create(itemWithSession) here.
      // For now, only local state/session storage update.
      setCartItems((prev) => [...prev, { ...cartItem, id: Date.now() }]); // Add a unique ID

      // Show success and go to cart
      setCurrentStep("cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleRemoveFromCart = (idToRemove) => {
    setCartItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // Simulate payment processing.
      // In a real app, this would involve integrating with a payment gateway.
      // For the local backend, we could send the final cart to the /api/donations endpoint.

      // Example: Saving donations to backend (if desired for local persistence)
      const donationPromises = cartItems.map((item) => {
        // Construct a Donation entity structure
        const donationData = {
          first_name: personalInfo.first_name,
          last_name: personalInfo.last_name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          address_line1: personalInfo.address_line1,
          address_line2: personalInfo.address_line2,
          city: personalInfo.city,
          state: personalInfo.state,
          country: personalInfo.country,
          zip_code: personalInfo.zip_code,
          donation_category: item.donation_category,
          amount: item.amount,
          is_anonymous: item.is_anonymous,
          status: "completed", // Assume completed after simulated checkout
        };
        return DonationCart.create(donationData); // Using DonationCart to save final donation
      });
      await Promise.all(donationPromises);

      setTimeout(() => {
        setCurrentStep("success");
        setCartItems([]);
        sessionStorage.removeItem(`donation_cart_${sessionId}`);
        setIsCheckingOut(false);
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  const handleBackToCategories = () => {
    setCurrentStep("categories");
    setSelectedCategory(null);
  };

  const handleContinueShopping = () => {
    setCurrentStep("categories");
    setSelectedCategory(null);
  };

  if (currentStep === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        >
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your generous donation has been processed successfully. May your
            contribution bring countless blessings.
          </p>
          <Button
            onClick={() => {
              setCurrentStep("categories");
              window.location.href = "/"; // Navigate to home
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      {/* Header */}
      <section className="bg-orange-50/95 backdrop-blur-sm py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Make a Donation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your generous contributions help us maintain the temple, conduct
            pujas, and serve the community.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Breadcrumb */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`px-3 py-1 rounded-full ${
                  currentStep === "categories"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1. Select Category
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  currentStep === "form"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2. Enter Details
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  currentStep === "cart"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3. Review & Pay
              </span>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === "categories" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {DONATION_CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <DonationCategoryCard
                      category={category}
                      onSelect={handleCategorySelect}
                      isSelected={selectedCategory?.name === category.name}
                    />
                  </motion.div>
                ))}
              </div>

              {cartItems.length > 0 && (
                <div className="max-w-md mx-auto">
                  <Button
                    onClick={() => setCurrentStep("cart")}
                    variant="outline"
                    className="w-full border-2 border-orange-500/50 hover:bg-orange-500/10 text-orange-600"
                  >
                    View Cart ({cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"})
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === "form" && selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <DonationForm
                selectedCategory={selectedCategory}
                onAddToCart={handleAddToCart}
                onBack={handleBackToCategories}
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
              />
            </motion.div>
          )}

          {currentStep === "cart" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <DonationCartComponent
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
