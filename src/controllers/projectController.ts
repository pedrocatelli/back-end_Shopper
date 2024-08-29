import { Request, Response } from 'express';
import { Medidor } from '../types/medidor';
import { GoogleAIFileManager } from "@google/generative-ai/server";

const API_KEY = 'AIzaSyDIc7urqWjcL4h8wHOk5xgGty0rITM9Sus';

export const uploadImage = async (req: Request, res: Response) => {
  
  const { image, customer_code, measure_datetime, measure_type } = req.body as Medidor;


  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
  }
  
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Implementar a lógica para processar a imagem e salvar as informações no banco de dados.

    const base64Data = image.replace(/^data:image\/png;base64,/, '');

    // Initialize GoogleAIFileManager with your API_KEY.
    const fileManager = new GoogleAIFileManager(genAI);

    // Upload the file and specify a display name.
    const uploadResponse = await fileManager.uploadFile(image, {
      mimeType: "base64",
      displayName: "Medidor",
    });

    // View the response.
    console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

    res.status(200).json({ message: 'Operação realizada com sucesso' });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
};

