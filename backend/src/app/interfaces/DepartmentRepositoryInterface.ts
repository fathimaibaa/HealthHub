
import { departmentRepositoryMongodbType } from "../../Frameworks/Database/Repositories/DepartmentRepositoryMongodb";

export const departmentDbRepository = (repository: ReturnType<departmentRepositoryMongodbType>) => {

  const getDepartmentbyName = async (deparmentName:string) =>repository.getDepartmentbyName(deparmentName)
  
  const addDepartment = async (department: any) => await repository.addDepartment(department);

  const getAllDepartments = async () => await repository.getAllDepartments();

  const updateDepartment = async (id: string, department: string) => await repository.updateDepartment(id, department);

  const blockDepartment = async (id: string) => await repository.blockDepartment(id);

  const unblockDepartment = async (id: string) => await repository.unblockDepartment(id);

  const listDepartments = async () => await repository.listDepartments();

  const unlistDepartments = async () => await repository.unlistDepartments();

  return {
    addDepartment,
    getAllDepartments,
    updateDepartment,
    blockDepartment,
    unblockDepartment,
    listDepartments,
    unlistDepartments,
    getDepartmentbyName
  };
};

export type IDepartmentRepository = typeof departmentDbRepository;
