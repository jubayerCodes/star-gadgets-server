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
exports.BadgeServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const getSearchQuery_1 = require("../../utils/getSearchQuery");
const badge_model_1 = require("./badge.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createBadge = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBadgeExist = yield badge_model_1.Badge.findOne({ title: payload.title });
    if (isBadgeExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Badge with this title already exists");
    }
    const badge = yield badge_model_1.Badge.create(payload);
    return badge;
});
const updateBadge = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBadgeExist = yield badge_model_1.Badge.findById(id);
    if (!isBadgeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Badge not found");
    }
    const badge = yield badge_model_1.Badge.findByIdAndUpdate(id, payload, { returnDocument: "after" });
    return badge;
});
const deleteBadge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBadgeExist = yield badge_model_1.Badge.findById(id);
    if (!isBadgeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Badge not found");
    }
    yield badge_model_1.Badge.findByIdAndDelete(id);
    return null;
});
const getAllBadges = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, search, sortBy, sortOrder } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const filter = {};
    if (search) {
        Object.assign(filter, (0, getSearchQuery_1.getSearchQuery)(search, ["title"]));
    }
    const badges = yield badge_model_1.Badge.find(filter)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield badge_model_1.Badge.countDocuments(filter);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { badges, meta };
});
exports.BadgeServices = {
    createBadge,
    updateBadge,
    deleteBadge,
    getAllBadges,
};
