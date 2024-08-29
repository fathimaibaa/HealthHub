import { HttpStatus } from "../../../types/HttpStatus";
import CustomError from "../../../utils/CustomError";


import DepartmentEntity, { DepartmentEntityType } from "../../../entities/DepartmentEntity";
import { CreateDepartmentInterface } from "../../../types/DepartmentInterface";
import { IDepartmentRepository } from "../../interfaces/DepartmentRepositoryInterface";

export const addDepartment = async (
  department: CreateDepartmentInterface, 
  departmentDbRepository: ReturnType<IDepartmentRepository>
  ) => {
    const{departmentName} = department;

    const deparmentAlreadyExist = await departmentDbRepository.getDepartmentbyName(departmentName)
    if(deparmentAlreadyExist){
    throw new CustomError("Department already exists",HttpStatus.BAD_REQUEST);
    }

    const departmentEntity : DepartmentEntityType = DepartmentEntity(departmentName) ;
    
    return  await departmentDbRepository.addDepartment(departmentEntity);
    
};


export const getAllDepartments = async (departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.getAllDepartments();
};

export const updateDepartment = async (id: string, departmentName: string, departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.updateDepartment(id, departmentName);
};

export const blockDepartment = async (id: string, departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.blockDepartment(id);
};

export const unblockDepartment = async (id: string, departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.unblockDepartment(id);
};

export const listDepartments = async (departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.listDepartments();
};


export const unlistDepartments = async (departmentDbRepository: ReturnType<IDepartmentRepository>) => {
  return await departmentDbRepository.unlistDepartments();
};
