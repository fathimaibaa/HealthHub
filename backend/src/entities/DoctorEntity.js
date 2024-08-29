"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = doctorEntity;
exports.googleSignInUserEntity = googleSignInUserEntity;
function doctorEntity(doctorName, email, phoneNumber, passsword, verification) {
    return {
        getDoctorName: () => doctorName,
        getEmail: () => email,
        getphoneNumber: () => phoneNumber,
        getPassword: () => passsword,
        getVerificationToken: () => verification
    };
}
function googleSignInUserEntity(name, email, picture, email_verified) {
    return {
        doctorName: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
    };
}
