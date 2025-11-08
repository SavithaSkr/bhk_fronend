import React from "react";
// Assuming you will copy Input, Select components
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Placeholder Shadcn components for local setup
const Input = ({ type, value, onChange, className, placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
  />
);
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-[100px] p-2 border rounded-md"
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

const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+91", country: "India" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+1", country: "Canada" },
];

export default function PhoneInput({ value, onChange }) {
  // Split the incoming value into code and number if it exists
  const initialCode = value ? value.split(" ")[0] : "+1";
  const initialNumber = value ? value.split(" ").slice(1).join(" ") : "";

  const [countryCode, setCountryCode] = React.useState(initialCode);
  const [number, setNumber] = React.useState(initialNumber);

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    onChange(`${countryCode} ${newNumber}`);
  };

  const handleCodeChange = (newCode) => {
    setCountryCode(newCode);
    onChange(`${newCode} ${number}`);
  };

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCodeChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((c) => (
            <SelectItem key={c.country} value={c.code}>
              {c.code} ({c.country})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder="Phone number"
        value={number}
        onChange={handleNumberChange}
      />
    </div>
  );
}
