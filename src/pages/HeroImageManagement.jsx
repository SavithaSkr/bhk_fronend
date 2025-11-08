import React, { useState, useEffect } from "react";
import { HeroImage } from "../services/entities.js"; // Updated import path
// Assuming you will copy Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle, Badge, Switch components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit, Image as ImageIcon, Save, X } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder Shadcn components for local setup
const Button = ({
  children,
  className,
  onClick,
  variant = "default",
  size = "default",
  type = "button",
}) => (
  <button
    className={`px-4 py-2 rounded-md ${
      variant === "default"
        ? "bg-blue-500 text-white"
        : "border border-blue-500 text-blue-500"
    } ${className}`}
    onClick={onClick}
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
const Textarea = ({ id, value, onChange, className, placeholder, rows }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className}`}
    placeholder={placeholder}
    rows={rows}
  ></textarea>
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
const Badge = ({ children, variant = "default" }) => (
  <span
    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
      variant === "default"
        ? "bg-gray-100 text-gray-800"
        : "bg-blue-100 text-blue-800"
    }`}
  >
    {children}
  </span>
);
const Switch = ({ id, checked, onCheckedChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <div className={`block bg-gray-600 w-10 h-6 rounded-full`}></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
          checked ? "translate-x-full bg-orange-500" : "translate-x-0"
        }`}
      ></div>
    </div>
  </label>
);

export default function HeroImageManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    alt_text: "",
    display_order: 1,
    is_active: true,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const fetchedImages = await HeroImage.list("display_order"); // Fetches from local backend
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error loading images:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingImage) {
        await HeroImage.update(editingImage._id, formData); // Use _id for MongoDB
      } else {
        await HeroImage.create(formData);
      }

      setFormData({
        title: "",
        image_url: "",
        alt_text: "",
        display_order: 1,
        is_active: true,
      });
      setEditingImage(null);
      setShowAddForm(false);
      loadImages();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleEdit = (image) => {
    setFormData({
      title: image.title,
      image_url: image.image_url,
      alt_text: image.alt_text || "",
      display_order: image.display_order || 1,
      is_active: image.is_active,
    });
    setEditingImage(image);
    setShowAddForm(true);
  };

  const handleDelete = async (imageId) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await HeroImage.delete(imageId); // Uses local backend
        loadImages();
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const toggleActive = async (image) => {
    try {
      await HeroImage.update(image._id, { is_active: !image.is_active }); // Uses local backend
      loadImages();
    } catch (error) {
      console.error("Error updating image status:", error);
    }
  };

  const cancelEdit = () => {
    setFormData({
      title: "",
      image_url: "",
      alt_text: "",
      display_order: 1,
      is_active: true,
    });
    setEditingImage(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-600" />
          <p className="text-lg text-gray-600">Loading hero images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hero Carousel Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage images displayed in the homepage hero section carousel
          </p>
        </motion.div>

        {/* Add New Image Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Current Images ({images.length})
          </h2>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Image
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingImage ? "Edit Image" : "Add New Image"}</span>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        className="mt-1"
                        placeholder="Enter image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        min="1"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_order: parseInt(e.target.value),
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Image URL *</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      required
                      className="mt-1"
                      placeholder="/assets/your-image.jpg" // Hint for local path
                    />
                  </div>

                  <div>
                    <Label htmlFor="alt_text">Alternative Text</Label>
                    <Textarea
                      id="alt_text"
                      value={formData.alt_text}
                      onChange={(e) =>
                        setFormData({ ...formData, alt_text: e.target.value })
                      }
                      className="mt-1"
                      placeholder="Describe the image for accessibility"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <Label htmlFor="is_active">Active (show in carousel)</Label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingImage ? "Update Image" : "Add Image"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Images List */}
        <div className="grid gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image._id} // Use _id for MongoDB
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Image Preview */}
                  <div className="md:col-span-1">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Image Details */}
                  <div className="md:col-span-2 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {image.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge
                          variant={image.is_active ? "default" : "secondary"}
                        >
                          {image.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          Order: {image.display_order}
                        </Badge>
                      </div>
                    </div>

                    {image.alt_text && (
                      <p className="text-gray-600 text-sm mb-3">
                        {image.alt_text}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 break-all">
                      {image.image_url}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 p-4 flex flex-col justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant={image.is_active ? "outline" : "default"}
                      onClick={() => toggleActive(image)}
                      className="flex items-center gap-2"
                    >
                      {image.is_active ? "Deactivate" : "Activate"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image._id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Images Added Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first hero carousel image to get started
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
