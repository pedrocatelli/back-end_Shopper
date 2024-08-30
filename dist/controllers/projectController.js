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
exports.uploadImage = void 0;
const server_1 = require("@google/generative-ai/server");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
    }
    else if (measure_type != ('WATER' || 'GAS')) {
        return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
    }
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const outputPath = path_1.default.join('src/img', 'output.png');
        fs_1.default.writeFile(outputPath, imageBuffer, (err) => {
            console.log(err);
            if (err) {
                console.error('Erro ao salvar a imagem:', err);
            }
            else {
                console.log('Imagem salva com sucesso em', outputPath);
            }
        });
        // Initialize GoogleAIFileManager with your API_KEY.
        const fileManager = new server_1.GoogleAIFileManager(process.env.GEMINI_API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            // Choose a Gemini model.
            model: "gemini-1.5-pro",
        });
        // Upload the file and specify a display name.
        const uploadResponse = yield fileManager.uploadFile(outputPath, {
            mimeType: "image/png",
            displayName: "Medidor",
        });
        // Generate content using text and the URI reference for the uploaded file.
        const result = yield model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri
                }
            },
            { text: "Qual o numero em destaque na imagem?" },
        ]);
        // Output the generated text to the console
        console.log(result.response.text());
        res.status(200).json({ message: 'Operação realizada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
    }
});
exports.uploadImage = uploadImage;
