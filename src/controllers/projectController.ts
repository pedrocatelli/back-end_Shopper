import { GoogleAIFileManager } from "@google/generative-ai/server";
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Medidor } from '../types/medidor';
import crypto from 'crypto';
import {pool} from '../db';

export const uploadImage = async (req: Request, res: Response) => {

  const { image, customer_code, measure_datetime, measure_type } = req.body as Medidor;


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
    const outputPath = path.join('src/img', 'output.png');

    fs.writeFile(outputPath, imageBuffer, (err) => {
      console.log(err);
      if (err) {
        console.error('Erro ao salvar a imagem:', err);
      } else {
        console.log('Imagem salva com sucesso em', outputPath);
      }
    });

    // Initialize GoogleAIFileManager with your API_KEY.
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({
      // Choose a Gemini model.
      model: "gemini-1.5-pro",
    });

    // Upload the file and specify a display name.
    const uploadResponse = await fileManager.uploadFile(outputPath, {
      mimeType: "image/png",
      displayName: "Medidor",
    });

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      { text: "Qual o numero em destaque na imagem (responda apenas o numero)?" },
    ]);

    // Output the generated text to the console
    console.log(result.response.text())
    console.log(generateTemporaryLink(outputPath))

    res.status(200).json({ message: 'Operação realizada com sucesso' });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
};

async function generateTemporaryLink(imageUrl: string): Promise<string> {
  const token = crypto.randomBytes(20).toString('hex');
  const expirationTime = Date.now() + 3600000;

  await pool.query(
      'INSERT INTO temporary_links (token, image_url, expires_at) VALUES ($1, $2, to_timestamp($3 / 1000.0))',
      [token, imageUrl, expirationTime]
  );

  return `http://localhost/download/${token}`;
}