"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const credentials_controller_1 = require("../controllers/credentials.controller");
const router = express_1.default.Router();
router.post('/save-x-credentials', credentials_controller_1.saveXCredentials);
exports.default = router;
