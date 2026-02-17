import React, { useState, useEffect, useRef } from "react";
import useMailAPI from "../hooks/useMailAPI.js";
import PhoneInput from "../components/contact/PhoneInput.jsx";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

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
const Button = ({ children, className, onClick, disabled = false, type = "button" }) => (
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

const Input = ({ id, type, value, onChange, required = false, className, placeholder }) => (
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

const Textarea = ({ id, value, onChange, required = false, rows, className, placeholder }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    rows={rows}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
  />
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Select = ({ value, onValueChange, children, required }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full p-2 border rounded-md"
    required={required}
  >
    {children}
  </select>
);

const SelectTrigger = ({ children }) => <div className="select-trigger">{children}</div>;
const SelectValue = ({ placeholder }) => <span className="select-value">{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

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
  const { sendEmail, loading: mailLoading, error: mailError } = useMailAPI();

  // ✅ captcha state
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  // ✅ Use env first; fallback to your site key if you didn't add env yet
  const RECAPTCHA_SITE_KEY =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Lc1r24sAAAAAC49bvbM9ZH_ib8KqziZBYjoRrxx";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      if (!captchaToken) {
        setFormState("error");
        throw new Error("Please verify captcha before submitting.");
      }

      const subject = `Contact Inquiry: ${formData.inquiry_type || "General"}`;
      const message = `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Inquiry Type: ${formData.inquiry_type}

Details:
${formData.details}`;

      await sendEmail({
        name: formData.name,
        email: formData.email,
        subject,
        message,
        captchaToken,
      });

      setFormState("submitted");

      // ✅ reset captcha so next submission requires human again
      setCaptchaToken("");
      recaptchaRef.current?.reset?.();
    } catch (error) {
      console.error("Submission error:", error);
      setFormState("error");
    }
  };

  // Reset form after success message
  useEffect(() => {
    if (formState === "submitted") {
      const timer = setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiry_type: "",
          details: "",
        });
        setFormState("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      {/* Header Section */}
      <section className="bg-orange-50/95 backdrop-blur-sm py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Connect with Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Engage in a conversation with our volunteer team to seek guidance,
            share your thoughts, or receive spiritual counsel.
          </p>
        </motion.div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left Column: Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Temple Information</h3>
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
                    <span>sbht.indiana@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="h-80 w-full rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.907516940122!2d-85.99152082559179!3d39.9658203829624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8814cb4d328b07dd%3A0xb1312d67149b9c93!2sSri%20Bhaktha%20Hanuman%20Temple%20%26%20Cultural%20Center!5e0!3m2!1sen!2sin!4v1770049630777!5m2!1sen!2sin"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                />
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
                  <h3 className="text-2xl font-semibold text-gray-800">Thank You!</h3>
                  <p className="text-gray-600 mt-2">
                    Your inquiry has been sent successfully. We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email ID *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
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
                      onValueChange={(value) => handleInputChange("inquiry_type", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <option value="" disabled>
                          Select a reason
                        </option>
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
                      onChange={(e) => handleInputChange("details", e.target.value)}
                      required
                      rows={5}
                    />
                  </div>

                  {/* ✅ reCAPTCHA */}
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setCaptchaToken(token || "")}
                      onExpired={() => setCaptchaToken("")}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={formState === "submitting" || mailLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3 flex justify-center"
                    >
                      {formState === "submitting" || mailLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin pt-2" />
                      ) : (
                        <Send className="w-5 h-5 mr-2 pt-1" />
                      )}
                      Submit Inquiry
                    </Button>

                    {(formState === "error" || mailError) && (
                      <p className="text-red-500 text-sm mt-2 text-center">
                        {mailError || "Something went wrong. Please try again."}
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
