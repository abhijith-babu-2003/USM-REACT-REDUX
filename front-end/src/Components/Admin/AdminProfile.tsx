import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../Redux/store";
import { adminLogout } from "../../Redux/Slices/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.admin?.admin);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600 text-lg">
        <p>No admin data available. Please log in.</p>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Profile
        </h2>

        <div className="flex justify-center mb-6">
          <img
            src={admin.profileImage || "https://via.placeholder.com/150"}
            alt="Admin Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        </div>

        <div className="space-y-4 text-sm text-gray-800 bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <span className="font-semibold italic text-gray-600">Name:</span>
            <span className="text-base font-medium text-gray-900">
              {admin.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold italic text-gray-600">Email:</span>
            <span className="text-base font-medium text-gray-900">
              {admin.email}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold italic text-gray-600">Phone:</span>
            <span className="text-base font-medium text-gray-900">
              {admin.phone}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg transition hover:bg-red "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
