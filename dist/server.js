"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use(projectRoutes_1.default);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
