import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosJWT from '../../utils/AxiosService';
import { ADMIN_API } from '../../Constants/Index';
import AdminHeader from '../../zzzz/Admin/HeaderSidebar/Header';
import AdminSidebar from '../../zzzz/Admin/HeaderSidebar/Sidebar';
import showToast from "../../utils/Toaster";

const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState<string>('');
  const [isListed, setIsListed] = useState<boolean>(false);

  useEffect(() => {
    axiosJWT.get<{ departmentName: string; isListed: boolean }>(`${ADMIN_API}/department/${id}`)
      .then(response => {
        setDepartmentName(response.data.departmentName);
        setIsListed(response.data.isListed);
      })
      .catch((error: unknown) => {
        console.log(error);
        showToast('Failed to fetch department details', 'error');
      });
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axiosJWT.put<{ success: boolean }>(
        `${ADMIN_API}/department/${id}`,
        { departmentName, isListed }
      );
      if (response.data.success) {
        showToast('Department updated successfully!', 'success');
        navigate('/admin/department');
      } else {
        showToast('Failed to update department', 'error');
      }
    } catch (error: unknown) {
      let errorMessage = 'An error occurred while updating the department';

      if (error && typeof (error as any).response === 'object') {
        const axiosError = error as any; 
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      showToast(errorMessage, 'error');
      console.error('Error updating department:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-black-950">Edit Department</h1>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="departmentName" className="block text-black-700 text-sm font-bold mb-2">
                Department Name
              </label>
              <input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-950 text-white rounded hover:bg-purple-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/department')}
                className="px-4 py-2 bg-purple-300 text-gray-700 rounded hover:bg-purple-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentPage;
