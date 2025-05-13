import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import FormModal from "./FormModal";
import apiService from "../services/api";
import { toast } from "react-toastify";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const user = apiService.getUser();
  const isAdmin = user?.role === "admin";

  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.getForms();
      setForms(data);
    } catch (error) {
      setError("Failed to fetch forms. Please try again later.");
      toast.error("Failed to fetch forms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async (formData) => {
    try {
      await apiService.createForm(formData);
      toast.success("Form created successfully!");
      fetchForms();
    } catch (error) {
      setError("Failed to create form.");
      toast.error("Failed to create form");
    }
  };

  const handleUpdateForm = async (formData) => {
    try {
      await apiService.updateForm(currentForm._id, formData);
      toast.success("Form updated successfully!");
      fetchForms();
    } catch (error) {
      setError("Failed to update form.");
      toast.error("Failed to update form");
    }
  };

  const handleDeleteForm = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await apiService.deleteForm(id);
        toast.success("Form deleted successfully!");
        fetchForms();
      } catch (error) {
        setError("Failed to delete form.");
        toast.error("Failed to delete form");
      }
    }
  };

  const openCreateModal = () => {
    setCurrentForm(null);
    setIsModalOpen(true);
  };

  const openEditModal = (form) => {
    setCurrentForm(form);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (currentForm) {
      handleUpdateForm(formData);
    } else {
      handleCreateForm(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6">
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome, {isAdmin ? "Admin" : "Guest"}
            </h1>
            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
              >
                <span className="mr-2">+</span> Add New Form
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              {isAdmin ? (
                <p>
                  No forms yet. Create one by clicking the 'Add New Form'
                  button.
                </p>
              ) : (
                <p>No forms available. Please check back later.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                      Address
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                      PIN
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                      Phone
                    </th>
                    {isAdmin && (
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{form.name}</td>
                      <td className="py-3 px-4 text-sm">{form.address}</td>
                      <td className="py-3 px-4 text-sm">{form.pin}</td>
                      <td className="py-3 px-4 text-sm">{form.phone}</td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(form)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-xs transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentForm}
      />
    </div>
  );
}

export default Dashboard;
