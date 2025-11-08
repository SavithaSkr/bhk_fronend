import React from "react";
// Assuming you will copy Button, Card, CardContent, CardHeader, CardTitle, Badge components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

import { Trash2, ShoppingCart, CreditCard, RotateCcw } from "lucide-react";

// Placeholder Shadcn components for local setup
const Button = ({
  children,
  className,
  onClick,
  disabled = false,
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
  >
    {children}
  </button>
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
const Badge = ({ children, className, variant = "default" }) => (
  <span
    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
      variant === "default"
        ? "bg-gray-100 text-gray-800"
        : "bg-blue-100 text-blue-800"
    } ${className}`}
  >
    {children}
  </span>
);

export default function DonationCart({
  cartItems,
  onRemoveItem,
  onCheckout,
  isCheckingOut,
}) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.amount, 0);
  };

  const hasRecurringItems = () => {
    return cartItems.some((item) => item.is_recurring);
  };

  if (cartItems.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-gray-50 rounded-lg">
        <CardContent className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500">Add donations to see them here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-orange-500" />
          Donation Cart ({cartItems.length}{" "}
          {cartItems.length === 1 ? "item" : "items"})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div
              key={item.id || index} // Use item.id if available, otherwise index
              className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {item.donation_category}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {item.is_anonymous ? "Anonymous Donor" : item.donor_name}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-green-100 text-green-800 border border-green-200">
                    ${item.amount.toFixed(2)}
                  </Badge>
                  {item.is_recurring && (
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {item.recurring_frequency}
                    </Badge>
                  )}
                  {item.is_anonymous && (
                    <Badge variant="outline">Anonymous</Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-800">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-orange-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>

          {hasRecurringItems() && (
            <div className="text-sm text-blue-600 mb-4 flex items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              <span>Includes recurring donations</span>
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {isCheckingOut ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>

        {/* Payment Methods Info */}
        <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
          <p className="mb-2">We accept:</p>
          <div className="flex justify-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Square Pay
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Google Pay
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
