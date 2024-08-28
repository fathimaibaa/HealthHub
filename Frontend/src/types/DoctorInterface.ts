export interface DoctorInterface {
    userId: any;
    rating?: ReviewInterface[];
    createdAt: string;
    status: string;
    id: any;
    _id:string,
    doctorName:string;
    email:string;
    phone:string;
    department:string;
    description?:string;
    profileImage?:string;
    lisenceCertificate?:string,
    education?:string;
    tenture?:string,
    wokringHospital?:string,
    role:string;
    isVerified?: boolean;
    isApproved?: boolean;
    isBlocked?: boolean;
    cerificateImage?:string;


}
export interface ReviewInterface {
  _id: string;
  doctor:string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewText?: string;
  createdAt: string; 
    appoinment: string;
  }
