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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/User/user.model");
const user_interface_1 = require("../modules/User/user.interface");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env_1.envVars.SERVER_URL}${env_1.envVars.GOOGLE_CREDENTIALS.GOOGLE_CALLBACK_URL}`,
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const googleId = profile.id;
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const avatar = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
        const name = profile.displayName;
        let user = yield user_model_1.User.findOne({
            auths: {
                $elemMatch: {
                    provider: user_interface_1.Provider.GOOGLE,
                    providerId: googleId,
                },
            },
        });
        if (user)
            return done(null, user);
        user = yield user_model_1.User.findOne({ email });
        if (user) {
            user.auths.push({
                provider: user_interface_1.Provider.GOOGLE,
                providerId: googleId,
            });
            if (!user.avatar)
                user.avatar = avatar;
            yield user.save();
            return done(null, user);
        }
        user = yield user_model_1.User.create({
            name,
            email,
            avatar,
            isVerified: true,
            auths: [
                {
                    provider: user_interface_1.Provider.GOOGLE,
                    providerId: googleId,
                },
            ],
        });
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
})));
exports.default = passport_1.default;
