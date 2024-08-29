"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DepartmentEntity;
function DepartmentEntity(departmentName, isListed = true) {
    return {
        getDepartmentName: () => departmentName,
        getIsListed: () => isListed
    };
}
