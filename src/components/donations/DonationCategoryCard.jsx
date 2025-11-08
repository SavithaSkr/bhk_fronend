import React from "react";
// Assuming you will copy Card, CardContent, CardHeader, CardTitle, Button to your components/ui folder
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils"; // Assuming you have a cn utility for tailwind conditional classes

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
const Button = ({ children, className, onClick, variant = "default" }) => (
  <button
    className={`px-4 py-2 rounded-md ${
      variant === "default"
        ? "bg-blue-500 text-white"
        : "border border-blue-500 text-blue-500"
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);
// Simple cn utility for local setup if you don't have one
const cn = (...classes) => classes.filter(Boolean).join(" ");

const CATEGORY_CONFIG = {
  "General Donation": {
    image: "/assets/output.jpg",
  },
  "Pooja Sponsorship": {
    image: "/assets/Poojasponsorship3.jpeg",
    imagePosition: "object-top",
  },
  Neivethiyam: {
    image: "/assets/neivedhiyam.jpg",
  },
  Annadhanam: {
    image: "/assets/annadanam.jpg",
  },
  Flower: {
    image: "/assets/flower.png", // Local path, adjust filename if different
  },
  "Vashtram / Cloth Donation": {
    image: "/assets/vashtramrevised.png",
  },
  "Aabharanam / Abhushanam": {
    image: "/assets/aabharanam.png",
  },
};

export default function DonationCategoryCard({
  category,
  onSelect,
  isSelected,
}) {
  const config = CATEGORY_CONFIG[category.name];

  return (
    <Card
      className={`
                h-full cursor-pointer transition-all duration-300 border-2 overflow-hidden rounded-lg
                ${
                  isSelected
                    ? "border-orange-500 shadow-xl scale-105"
                    : "border-gray-200 hover:border-orange-500/50 hover:shadow-lg hover:scale-102"
                }
                bg-white
            `}
      onClick={() => onSelect(category)}
    >
      <div className="relative">
        <div className="h-32 overflow-hidden">
          <img
            src={config.image}
            alt={category.name}
            className={cn("w-full h-full object-cover", config.imagePosition)}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800 leading-tight">
          {category.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm mb-4 h-10">
          {category.description}
        </p>

        <Button
          className={cn(
            "w-full transition-all duration-300",
            isSelected
              ? "bg-transparent hover:bg-orange-600 text-orange-500"
              : "border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500  text-lg rounded-full transition-colors"
          )}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardContent>
    </Card>
  );
}
