import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import FormModal from "./FormModal";
import apiService from "../services/api";

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
      fetchForms();
    } catch (error) {
      setError("Failed to create form.");
    }
  };

  const handleUpdateForm = async (formData) => {
    try {
      await apiService.updateForm(currentForm._id, formData);
      fetchForms();
    } catch (error) {
      setError("Failed to update form.");
    }
  };

  const handleDeleteForm = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await apiService.deleteForm(id);
        fetchForms();
      } catch (error) {
        setError("Failed to delete form.");
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

      <div className="container mx-auto p-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">
              Welcome, {isAdmin ? "Admin" : "Guest"}
            </h1>
            {isAdmin && (
              <button
                onClick={openCreateModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <span className="mr-1">+</span> Add New Form
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left border-b">Name</th>
                    <th className="py-2 px-4 text-left border-b">Address</th>
                    <th className="py-2 px-4 text-left border-b">PIN</th>
                    <th className="py-2 px-4 text-left border-b">Phone</th>
                    {isAdmin && (
                      <th className="py-2 px-4 text-left border-b">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{form.name}</td>
                      <td className="py-2 px-4 border-b">{form.address}</td>
                      <td className="py-2 px-4 border-b">{form.pin}</td>
                      <td className="py-2 px-4 border-b">{form.phone}</td>
                      {isAdmin && (
                        <td className="py-2 px-4 border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(form)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
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
