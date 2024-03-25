"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOne = exports.fetchAll = exports.deleteDocument = exports.editDocument = exports.addDocument = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const caching_middleware_1 = require("../middleware/caching-middleware");
const addDocument = (Model) => async (data) => {
    return Model.create(data);
};
exports.addDocument = addDocument;
const editDocument = (Model) => async (data) => {
    const { id, ...res } = data;
    return Model.findOneAndUpdate({ _id: id }, { $set: res });
};
exports.editDocument = editDocument;
const deleteDocument = (Model) => async (id) => {
    return Model.deleteOne({ _id: id });
};
exports.deleteDocument = deleteDocument;
const fetchOne = (fn) => async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next({ code: 400, msg: 'Invalid  ID' });
        }
        const data = await fn(req.params.id);
        if (!data) {
            return next({ code: 404, msg: 'Data not found' });
        }
        const cacheKey = req.originalUrl;
        await (0, caching_middleware_1.setToCache)(cacheKey, data, 600);
        return res.status(200).json({ code: 200, data: data });
    }
    catch (error) {
        return next({ code: 404, msg: error.message });
    }
};
exports.fetchOne = fetchOne;
const fetchAll = (fn) => async (req, res, next) => {
    try {
        const data = await fn();
        const cacheKey = req.originalUrl;
        await (0, caching_middleware_1.setToCache)(cacheKey, data, 600);
        return res.status(200).json({ code: 200, msg: "Successfully fetched", data: data });
    }
    catch (error) {
        return next({ code: 404, msg: error.message });
    }
};
exports.fetchAll = fetchAll;
