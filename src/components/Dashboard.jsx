import { useState, useEffect } from "react";
import apiService from "../services/api";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pin: "",
    phone: "",
  });
  const [editingForm, setEditingForm] = useState(null);
  const [error, setError] = useState(null);
  const user = apiService.getUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    console.log("Dashboard useEffect running");
    console.log("User:", user);
    const fetchForms = async () => {
      try {
        const data = await apiService.getForms();
        setForms(data);
      } catch (err) {
        setError("Failed to fetch forms");
      }
    };
    fetchForms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingForm) {
        const updatedForm = await apiService.updateForm(
          editingForm._id,
          formData
        );
        setForms(
          forms.map((f) => (f._id === updatedForm._id ? updatedForm : f))
        );
        setEditingForm(null);
      } else {
        const newForm = await apiService.createForm(formData);
        setForms([...forms, newForm]);
      }
      setFormData({ name: "", address: "", pin: "", phone: "" });
    } catch (err) {
      setError("Failed to save form");
    }
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setFormData({
      name: form.name,
      address: form.address,
      pin: form.pin,
      phone: form.phone,
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteForm(id);
      setForms(forms.filter((f) => f._id !== id));
    } catch (err) {
      setError("Failed to delete form");
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isAdmin ? "Admin Dashboard" : "Guest Dashboard"}
          </h1>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isAdmin && (
          <form onSubmit={handleSubmit} className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingForm ? "Edit Form" : "Create Form"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="PIN (6 digits)"
                value={formData.pin}
                onChange={(e) =>
                  setFormData({ ...formData, pin: e.target.value })
                }
                className="border p-2 rounded w-full"
                pattern="\d{6}"
                required
              />
              <input
                type="text"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border p-2 rounded w-full"
                pattern="\d{10}"
                required
              />
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
              >
                {editingForm ? "Update Form" : "Create Form"}
              </button>
              {editingForm && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingForm(null);
                    setFormData({ name: "", address: "", pin: "", phone: "" });
                  }}
                  className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <h2 className="text-xl font-bold mb-4">Forms</h2>
        {forms.length === 0 ? (
          <p>No forms available.</p>
        ) : (
          <ul className="space-y-4">
            {forms.map((form) => (
              <li
                key={form._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {form.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {form.address}
                  </p>
                  <p>
                    <strong>PIN:</strong> {form.pin}
                  </p>
                  <p>
                    <strong>Phone:</strong> {form.phone}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(form)}
                      className="py-1 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(form._id)}
                      className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
