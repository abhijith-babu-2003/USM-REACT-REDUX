/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import { deleteUser, fetchAllUsers } from "../../Redux/Slices/adminSlice";
import { createUserAPI, udpateUserAPI } from "../../api/adminAuth";
import { toast } from "react-toastify";
import AddUserModel from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import Swal from "sweetalert2";

interface Userdata {
  _id: string;
  name: string;
  phone: number;
  email: string;
  password: string;
  profileImage: string;
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModelOpen, setIsEditUserModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Userdata | null>(null);
  const [searchQuery, setSearchquery] = useState<string>("");

  const { users, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  const admin = useSelector((state: RootState) => state.admin.admin);

  useEffect(() => {
    const getUsers = async () => {
      if (!admin?.token) {
        console.error("No admin token available");
        toast.error("No authentication token available");
        return;
      }

      try {
        const result = await dispatch(fetchAllUsers(admin.token));
        if (fetchAllUsers.rejected.match(result)) {
          console.error("fetchAllUsers was rejected:", result.payload);
          toast.error(`Failed to fetch users: ${result.payload}`);
        }
      } catch (err) {
        console.error("Error in getUsers:", err);
        toast.error("Failed to fetch users");
      }
    };

    getUsers();
  }, [dispatch, admin?.token]);

  const handleCreateUser = async (userData: Userdata) => {
    try {
      const response = await createUserAPI(userData);
      if (response.status === 200) {
        toast.success("User created successfully");
        if (admin?.token) {
          await dispatch(fetchAllUsers(admin.token));
        } else {
          toast.error("Admin token not found");
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user");
    }
  };

  const handleEditUser = async (userData: any) => {
    setSelectedUser(userData);
    setIsEditUserModelOpen(true);
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      if (!admin?.token) {
        toast.error("Admin token missing");
        return;
      }
      const response = await udpateUserAPI(updatedUser, admin?.token);
      if (response.status === 200) {
        toast.success("User updated successfully");
        await dispatch(fetchAllUsers(admin?.token));
      }
    } catch (error) {
      console.error("Error updating user", error);
      toast.error("An error occurred while updating the user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      if (!admin?.token) {
        toast.error("admin token missing");
        return;
      }
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });
      if (!confirmed.isConfirmed) return;
      await dispatch(deleteUser({ userId: id, token: admin.token }));
      toast.success("User deleted Successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("failed to delete user");
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-500">Loading users...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <button
          onClick={() => admin?.token && dispatch(fetchAllUsers(admin.token))}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="mb-2 sm:mb-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Add User
        </button>

        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchquery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-700">
                Image
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">
                Phone
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-6">
                    <img
                      src={user.profileImage || "/default-avatar.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{String(user.phone)}</td>
                  <td className="py-3 px-6 space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button onClick={()=>handleDeleteUser((user as any)._id)} className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isAddUserModalOpen && (
        <AddUserModel
          onClose={() => setIsAddUserModalOpen(false)}
          onUserCreated={handleCreateUser}
        />
      )}
      {isEditUserModelOpen && selectedUser && (
        <EditUserModal
          user={{ ...selectedUser, phone: String(selectedUser.phone) }}
          onClose={() => setIsEditUserModelOpen(false)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}
