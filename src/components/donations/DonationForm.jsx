import React, { useState } from "react";
// Assuming you will copy Button, Input, Label, Select components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ShoppingCart, Plus, RotateCcw } from "lucide-react";

// Placeholder Shadcn components for local setup
const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  type = "button",
  variant = "default",
}) => (
  <button
    className={`px-4 py-2 rounded-md ${
      variant === "default"
        ? "bg-blue-500 text-white"
        : "border border-blue-500 text-blue-500"
    } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
  min,
  step,
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
    min={min}
    step={step}
  />
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
const Checkbox = ({ id, checked, onCheckedChange }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
  />
);
const RadioGroup = ({ children, value, onValueChange }) => (
  <div
    role="radiogroup"
    aria-labelledby="radio-group-label"
    className="flex space-x-2"
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        checked: child.props.value === value,
        onChange: () => onValueChange(child.props.value),
      })
    )}
  </div>
);
const RadioGroupItem = ({ id, value, children, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
    />
    <span>{children}</span>
  </label>
);

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function DonationForm({
  selectedCategory,
  onAddToCart,
  onBack,
  personalInfo,
  setPersonalInfo,
}) {
  const [donationDetails, setDonationDetails] = useState({
    amount: "",
    is_recurring: false,
    recurring_frequency: "monthly",
    is_anonymous: false,
  });

  const [amountType, setAmountType] = useState("custom");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedAmounts = [25, 51, 101, 251, 501, 1001];

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDonationChange = (field, value) => {
    setDonationDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmountSelect = (amount) => {
    setAmountType("predefined");
    setDonationDetails((prev) => ({
      ...prev,
      amount: amount,
    }));
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);

    const cartItem = {
      donation_category: selectedCategory.name,
      amount: parseFloat(donationDetails.amount),
      is_recurring: donationDetails.is_recurring,
      recurring_frequency: donationDetails.is_recurring
        ? donationDetails.recurring_frequency
        : null,
      donor_name: `${personalInfo.first_name} ${personalInfo.last_name}`,
      is_anonymous: donationDetails.is_anonymous,
      personal_info: personalInfo, // Not directly stored in DonationCart model, but passed for context
    };

    await onAddToCart(cartItem);
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return (
      personalInfo.first_name &&
      personalInfo.last_name &&
      personalInfo.email &&
      personalInfo.phone &&
      donationDetails.amount &&
      parseFloat(donationDetails.amount) > 0 &&
      personalInfo.address_line1 &&
      personalInfo.city &&
      personalInfo.state &&
      personalInfo.zip_code
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={personalInfo.first_name}
                  onChange={(e) =>
                    handlePersonalInfoChange("first_name", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={personalInfo.last_name}
                  onChange={(e) =>
                    handlePersonalInfoChange("last_name", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    handlePersonalInfoChange("email", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    handlePersonalInfoChange("phone", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address_line1">Address Line-1 *</Label>
              <Input
                id="address_line1"
                type="text"
                value={personalInfo.address_line1}
                onChange={(e) =>
                  handlePersonalInfoChange("address_line1", e.target.value)
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address_line2">Address Line-2</Label>
              <Input
                id="address_line2"
                type="text"
                value={personalInfo.address_line2}
                onChange={(e) =>
                  handlePersonalInfoChange("address_line2", e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={personalInfo.city}
                  onChange={(e) =>
                    handlePersonalInfoChange("city", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select
                  value={personalInfo.state}
                  onValueChange={(value) =>
                    handlePersonalInfoChange("state", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code *</Label>
                <Input
                  id="zip_code"
                  type="text"
                  value={personalInfo.zip_code}
                  onChange={(e) =>
                    handlePersonalInfoChange("zip_code", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Details */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Donation for: {selectedCategory.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block text-gray-800">
                Select Amount (USD)
              </Label>

              {/* Predefined Amounts */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    className={`h-12 text-base ${
                      donationDetails.amount === amount
                        ? "border-orange-500 bg-orange-50 text-orange-600 font-bold"
                        : "text-gray-600 hover:border-orange-400"
                    }`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="custom_amount">Custom Amount</Label>
                <Input
                  id="custom_amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amountType === "custom" ? donationDetails.amount : ""}
                  onChange={(e) => {
                    setAmountType("custom");
                    handleDonationChange("amount", e.target.value);
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Recurring Donation */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={donationDetails.is_recurring}
                  onCheckedChange={(checked) =>
                    handleDonationChange("is_recurring", checked)
                  }
                />
                <Label
                  htmlFor="is_recurring"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  Make this a recurring donation
                </Label>
              </div>

              {donationDetails.is_recurring && (
                <Select
                  value={donationDetails.recurring_frequency}
                  onValueChange={(value) =>
                    handleDonationChange("recurring_frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_anonymous"
                checked={donationDetails.is_anonymous}
                onCheckedChange={(checked) =>
                  handleDonationChange("is_anonymous", checked)
                }
              />
              <Label htmlFor="is_anonymous" className="text-sm text-gray-600">
                List me as anonymous donor
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onBack} className="px-6">
          ← Back
        </Button>

        <Button
          onClick={handleAddToCart}
          disabled={!isFormValid() || isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {isSubmitting ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
