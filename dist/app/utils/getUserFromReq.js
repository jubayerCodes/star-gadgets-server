"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserToReq = exports.getUserFromReq = void 0;
const getUserFromReq = (req) => {
    return req.user;
};
exports.getUserFromReq = getUserFromReq;
const setUserToReq = (req, user) => {
    req.user = user;
};
exports.setUserToReq = setUserToReq;
