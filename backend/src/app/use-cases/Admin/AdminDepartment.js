"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlistDepartments = exports.listDepartments = exports.unblockDepartment = exports.blockDepartment = exports.updateDepartment = exports.getAllDepartments = exports.addDepartment = void 0;
const HttpStatus_1 = require("../../../types/HttpStatus");
const CustomError_1 = __importDefault(require("../../../utils/CustomError"));
const DepartmentEntity_1 = __importDefault(require("../../../entities/DepartmentEntity"));
const addDepartment = (department, departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName } = department;
    const deparmentAlreadyExist = yield departmentDbRepository.getDepartmentbyName(departmentName);
    if (deparmentAlreadyExist) {
        throw new CustomError_1.default("Department already exists", HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const departmentEntity = (0, DepartmentEntity_1.default)(departmentName);
    return yield departmentDbRepository.addDepartment(departmentEntity);
});
exports.addDepartment = addDepartment;
const getAllDepartments = (departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.getAllDepartments();
});
exports.getAllDepartments = getAllDepartments;
const updateDepartment = (id, departmentName, departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.updateDepartment(id, departmentName);
});
exports.updateDepartment = updateDepartment;
const blockDepartment = (id, departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.blockDepartment(id);
});
exports.blockDepartment = blockDepartment;
const unblockDepartment = (id, departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.unblockDepartment(id);
});
exports.unblockDepartment = unblockDepartment;
const listDepartments = (departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.listDepartments();
});
exports.listDepartments = listDepartments;
const unlistDepartments = (departmentDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield departmentDbRepository.unlistDepartments();
});
exports.unlistDepartments = unlistDepartments;
