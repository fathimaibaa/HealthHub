import { useEffect, useState, ChangeEvent } from "react";
import axiosJWT from "../utils/AxiosService";
import showToast from "../utils/Toaster";
import { DoctorInterface } from "../types/DoctorInterface";
import { DOCTOR_API, nameRegex, phoneRegex } from "../constants/Index";
import { uploadImagesToCloudinary, uploadCertificateToCloudinary } from "../Api/UploadImages";
import { useNavigate } from 'react-router-dom';
import { getItemFromLocalStorage } from "../utils/Setnget";

const useDoctorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DoctorInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    doctorName: string;
    gender: string;
    email: string;
    age: number | null;
    phoneNumber: string;
    department: any;
    education: string;
    tenture: string;
    wokringHospital: string;
    status: string;
    description: string;
    imageFile: File | null;
    lisenceCertificate: File | null;
    degreeCertificate: File | null; 
  }>({
    doctorName: "",
    gender: "",
    email: "",
    age: null,
    department: "",
    description: "",
    phoneNumber: "",
    education: "",
    tenture: "",
    wokringHospital: "",
    status: "pending",
    imageFile: null,
    lisenceCertificate: null,
    degreeCertificate: null, 
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [degreePreview, setDegreePreview] = useState<string | null>(null); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosJWT.get(DOCTOR_API + "/profile");
        const { doctor } = data;
        setFormData((prev) => ({
          ...prev,
          doctorName: doctor?.doctorName,
          age: doctor?.age,
          gender: doctor?.gender,
          department: doctor?.department,
          description: doctor?.description,
          education: doctor?.education,
          tenture: doctor?.tenture,
          wokringHospital: doctor?.wokringHospital,
          email: doctor?.email,
          phoneNumber: doctor?.phoneNumber,
          lisenceCertificate: doctor?.lisenceCertificate,
          degreeCertificate: doctor?.degreeCertificate,
          status: doctor?.status
        }));
        setImagePreview(doctor?.profileImage || "");
        setCertificatePreview(doctor?.lisenceCertificate || "");
        setDegreePreview(doctor?.degreeCertificate || ""); 
      } catch (error) {
        console.error("Error fetching profile data:", error);
        showToast("Oops! Something went wrong while fetching the doctor >>>>>>>>", "error");
      }
    };
    const fetchDepartments = async () => {
      try {
        const { data } = await axiosJWT.get(DOCTOR_API + "/department/list");

        setDepartments(data.departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        showToast("Oops! Something went wrong while fetching departments", "error");
      }
    };


    fetchProfile();
    fetchDepartments();

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "imageFile" || name === "lisenceCertificate" || name === "degreeCertificate") { 
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files && fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (name === "imageFile") setImagePreview(reader.result as string);
          else if (name === "lisenceCertificate") setCertificatePreview(reader.result as string);
          else setDegreePreview(reader.result as string); 
        };
        reader.readAsDataURL(file);
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    } else {
      if (name === "doctorName") {
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (!nameRegex.test(value)) {
          errorMessage = "First letter must be capital and no leading or trailing space";
        }

      } else if (name === "phoneNumber") {
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          errorMessage = "Phone number must have 10 numbers";
        }
      } else if (name === "tenture") {
        const tenture = parseInt(value, 10);
        if (isNaN(tenture) || tenture < 0) {
          errorMessage = "Tenture must be a positive number";
        } else if (tenture > 50) {
          errorMessage = "Give a valid tenture";
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: name === "age" ? parseInt(value, 10) : value,
      }));
    }

    setError(errorMessage);
  };

  const handleSubmit = async () => {
    if (!error) {
      setIsSubmitting(true);
      try {
        const imageUrl = await uploadImagesToCloudinary(formData.imageFile);
        const certificateUrl = await uploadCertificateToCloudinary(formData.lisenceCertificate);
        const degreeUrl = await uploadCertificateToCloudinary(formData.degreeCertificate); 



        const response = await axiosJWT.patch(DOCTOR_API + "/profile/edit", {
          doctorName: formData.doctorName,
          gender: formData.gender,
          age: formData.age,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
          education: formData.education,
          tenture: formData.tenture,
          wokringHospital: formData.wokringHospital,
          description: formData.description,
          profileImage: imageUrl || profile?.profileImage,
          lisenceCertificate: certificateUrl || profile?.lisenceCertificate,
          degreeCertificate: degreeUrl || profile?.degreeCertificate, 
        });

        showToast(response?.data?.message);

        setIsSubmitting(false);
        navigate('/doctor');
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error updating profile:", error);
        showToast("Oops! Something went wrong while updating profile", "error");
      }
    }
  };

  const handleVerify = () => {
    setIsVerified(true);
  };

  return {
    profile,
    formData,
    imagePreview,
    certificatePreview,
    degreePreview, 
    error,
    isSubmitting,
    departments,
    handleInputChange,
    handleSubmit,
    handleVerify,
  };
};

export default useDoctorProfile;
