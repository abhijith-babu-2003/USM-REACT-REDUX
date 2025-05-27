import React, { useState } from "react";
import { uploadImageToCloudinary } from "../../api/uploadImage";

interface UserProps {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  onClose: () => void;
  onSave: (updatedUser: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
  }) => void;
}

export default function EditUserModel({ user, onClose, onSave }: UserProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!name || name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be a 10-digit number.";
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];


      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(null); 
    }
  };

  const handleSaveChanges = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null); 

    let imageUrl = user?.profileImage;
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    onSave({
      _id: user._id,
      name,
      email,
      phone,
      profileImage: imageUrl,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

    {error && (
      <p className="text-red-500 text-sm mb-2">{error}</p>
    )}

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Profile Image:</label>
      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
      {previewImage && (
        <img src={previewImage} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover border" />
      )}
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">Phone:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        maxLength={10}
        className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex justify-end space-x-2">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveChanges}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
</div>

  );
}