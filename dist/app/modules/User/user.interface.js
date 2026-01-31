"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
var Provider;
(function (Provider) {
    Provider["LOCAL"] = "LOCAL";
    Provider["GOOGLE"] = "GOOGLE";
})(Provider || (exports.Provider = Provider = {}));
