import type { AppDispatch, RootState } from "../../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logout, updateUserProfile } from "../../Redux/Slices/userSlice";
import { uploadImageToCloudinary } from "../../api/uploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.user?.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);

  useEffect(() => {
    if (user && isModalOpen) {
      console.log("Initializing form fields with user data:", user);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(String(user.phone || ""));
      setPreviewImage(user.profileImage || null);
      setValidationError(null);
    }
  }, [user, isModalOpen]);

  const handleEditProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    setValidationError(null);
    setProfileImage(null);
    setPreviewImage(user?.profileImage || null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const validateForm = () => {
    if (!name.trim()) {
      setValidationError("Name is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Invalid email format.");
      return false;
    }

    if (!phone.match(/^\d{10,}$/)) {
      setValidationError("Phone number must be at least 10 digits.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSaveChanges = async () => {
    console.log("Save changes clicked");

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    if (!token) {
      setValidationError("Authentication token not found. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = user?.profileImage;

      if (profileImage) {
        console.log("Uploading new image...");
        imageUrl = await uploadImageToCloudinary(profileImage);
        console.log("New image URL:", imageUrl);
      }

      const updateData = {
        name: name.trim(),
        email: email.trim(),
        phone: Number(phone),
        token,
        profileImage: imageUrl || "",
      };

      console.log("Updating user profile with data:", updateData);
      
      const result = await dispatch(updateUserProfile(updateData));
      console.log("result is ",result);

      if (updateUserProfile.fulfilled.match(result)) {
        console.log("Profile updated successfully");
        toast.success("Profile updated successfully");
        setIsModalOpen(false);
        setProfileImage(null);
        setPreviewImage(null);
      } else {
        console.log("Profile update failed:", result);

        setValidationError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setValidationError("An error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setValidationError("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setValidationError(null);
    }
  };

  const handleModalClose = () => {
    console.log("Modal close clicked");
    setIsModalOpen(false);
    setValidationError(null);
    setProfileImage(null);
    setPreviewImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        <p>No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className=" bg-gray-600 min-h-screen flex justify-center items-center  p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 italic">
          Profile Page
        </h2>

        <div className="flex justify-center mb-4">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
        </div>
    <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-2">User Details</h2>
          <div>
            <span className="font-semibold italic text-gray-800">Name:</span>{" "}
            {user.name}
          </div>
          <div>
            <span className="font-semibold italic text-gray-800">Email:</span>{" "}
            {user.email}
          </div>
          <div>
            <span className="font-semibold italic text-gray-800">Phone:</span>{" "}
            {user.phone}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleEditProfile}
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-110 
            duration-300 ease-in-out
               "
            disabled={loading || isSubmitting}
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:scale-110 duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal - Force render with explicit check */}
      {isModalOpen === true && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={handleBackdropClick}
          style={{ display: "flex" }} // Force display
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                
              </button>
            </div>

            {validationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {validationError}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
