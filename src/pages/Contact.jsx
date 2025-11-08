import React, { useState } from "react";
import { ContactInquiry } from "../services/entities.js"; // Updated import path
// Assuming you will copy Button, Input, Textarea, Label, Select components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PhoneInput from "../components/contact/PhoneInput.jsx"; // Updated import path
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";

// Fix for default marker icon issue with webpack (important for local Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Placeholder Shadcn components for local setup
const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  type = "button",
}) => (
  <button
    className={`px-4 py-2 rounded-md bg-blue-500 text-white ${className} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    {children}
  </button>
);
const Input = ({
  id,
  type,
  value,
  onChange,
  required = false,
  className,
  placeholder,
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
  />
);
const Textarea = ({
  id,
  value,
  onChange,
  required = false,
  rows,
  className,
  placeholder,
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    rows={rows}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
  ></textarea>
);
const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
  </label>
);
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full p-2 border rounded-md"
  >
    {children}
  </select>
);
const SelectTrigger = ({ children }) => (
  <div className="select-trigger">{children}</div>
);
const SelectValue = ({ placeholder }) => (
  <span className="select-value">{placeholder}</span>
);
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const INQUIRY_OPTIONS = [
  "Priest Booking",
  "Temple Pooja services",
  "Upcoming Programs",
  "Donations",
  "Refunds",
  "Suggestions",
  "Complaints",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "",
    details: "",
  });
  const [formState, setFormState] = useState("idle"); // idle, submitting, submitted, error

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState("submitting");
    try {
      await ContactInquiry.create(formData); // Uses local backend
      setFormState("submitted");
      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiry_type: "",
        details: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setFormState("error");
    }
  };

  // Correct coordinates for 10080 E 121st Street, Fishers, IN 46037
  const templePosition = [39.9568, -85.9688];

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      {/* Header Section */}
      <section className="bg-orange-50/95 backdrop-blur-sm py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Connect with Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Engage in a conversation with our volunteer team to seek guidance,
            share your thoughts, or receive spiritual counsel. We are here to
            support and guide you on your spiritual journey.
          </p>
        </motion.div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left Column: Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Temple Information
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                    <span>
                      10080 E 121st Street, Suite 130A
                      <br />
                      Fishers, IN 46037
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <span>248-525-8917</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <span>info@hanumantemple.org</span>
                  </div>
                </div>
              </div>
              <div className="h-80 w-full rounded-xl shadow-lg overflow-hidden">
                <MapContainer
                  center={templePosition}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href__="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={templePosition}>
                    <Popup>
                      <div className="text-center">
                        <strong>Sri Bhaktha Hanuman Temple</strong>
                        <br />
                        10080 E 121st Street, Suite 130A
                        <br />
                        Fishers, IN 46037
                        <br />
                        <em>Indiana</em>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:col-span-3 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            >
              {formState === "submitted" ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Your inquiry has been sent successfully. We will get back to
                    you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email ID</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => handleInputChange("phone", value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="inquiry_type">Enquiry Regarding *</Label>
                    <Select
                      value={formData.inquiry_type}
                      onValueChange={(value) =>
                        handleInputChange("inquiry_type", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="details">Please type details *</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) =>
                        handleInputChange("details", e.target.value)
                      }
                      required
                      rows={5}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3 flex justify-center"
                    >
                      {formState === "submitting" ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin pt-2" />
                      ) : (
                        <Send className="w-5 h-5 mr-2 pt-1" />
                      )}
                      Submit Inquiry
                    </Button>
                    {formState === "error" && (
                      <p className="text-red-500 text-sm mt-2 text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
