"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userEntity;
exports.googleSignInUserEntity = googleSignInUserEntity;
function userEntity(name, email, phoneNumber, password, authenticationMethod) {
    return {
        name: () => name,
        getEmail: () => email,
        getphoneNumber: () => phoneNumber,
        getPassword: () => password,
        getAuthenticationMethod: () => authenticationMethod,
    };
}
function googleSignInUserEntity(name, email, picture, email_verified, authenticationMethod) {
    return {
        name: () => name,
        email: () => email,
        picture: () => picture,
        email_verified: () => email_verified,
        authenticationMethod: () => authenticationMethod,
    };
}
