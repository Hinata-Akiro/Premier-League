"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const varibales_1 = __importDefault(require("./config/varibales"));
const dbconnection_1 = require("./config/dbconnection");
const PORT = varibales_1.default.PORT || 3030;
app_1.default.listen(PORT, async () => {
    await (0, dbconnection_1.dbConnection)();
    console.log(`Server is running on port http://localhost:${PORT}`);
});
