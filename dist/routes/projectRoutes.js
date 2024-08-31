"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const confirmController_1 = require("../controllers/confirmController");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.post("/update", projectController_1.uploadImage);
router.patch("/confirm", confirmController_1.confirmImage);
exports.default = router;
