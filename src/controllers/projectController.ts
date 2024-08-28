import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { GoogleAIFileManager } from "@google/generative-ai/server";
const API_KEY = ' ';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const { imageBase64 } = req.body;
    //const fileManager = new GoogleAIFileManager(process.env.API_KEY);

    if (!imageBase64) {
      return res.status(400).json({ message: 'Os dados fornecidos no corpo da requisição são inválidos' });
    }

    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(__dirname, '../uploads/image.png');


    res.status(200).json({ message: 'Operação realizada com sucesso', path: filePath });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
};
