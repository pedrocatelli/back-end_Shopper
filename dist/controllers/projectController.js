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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const server_1 = require("@google/generative-ai/server");
const API_KEY = 'AIzaSyDIc7urqWjcL4h8wHOk5xgGty0rITM9Sus';
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
    }
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        // Implementar a lógica para processar a imagem e salvar as informações no banco de dados.
        const base64Data = image.replace(/^data:image\/png;base64,/, '');
        // Initialize GoogleAIFileManager with your API_KEY.
        const fileManager = new server_1.GoogleAIFileManager(genAI);
        // Upload the file and specify a display name.
        const uploadResponse = yield fileManager.uploadFile(image, {
            mimeType: "base64",
            displayName: "Medidor",
        });
        // View the response.
        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
        res.status(200).json({ message: 'Operação realizada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
    }
});
exports.uploadImage = uploadImage;
