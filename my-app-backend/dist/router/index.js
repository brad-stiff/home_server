"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./routes/user"));
const movies_1 = __importDefault(require("./routes/movies"));
const router = (0, express_1.Router)();
router.use('/users', user_1.default);
router.use('/movies', movies_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map