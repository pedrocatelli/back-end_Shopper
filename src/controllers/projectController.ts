import { GoogleAIFileManager } from "@google/generative-ai/server";
import crypto from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { Medidor } from '../types/medidor';

export const uploadImage = async (req: Request, res: Response) => {

  const { image, customer_code, measure_datetime, measure_type } = req.body as Medidor;

  const queryMonth = `
            SELECT DATE_TRUNC('month', measure_datetime) AS month_start
            FROM public.measures
            WHERE customer_id = $1
              AND measure_type = $2;
        `;

        const valuesM = [customer_code, measure_type];
        const monsthExists = await pool.query(queryMonth, valuesM);

  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
  }
  else if (measure_type != ('WATER' || 'GAS')) {
    return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
  }
  else if(monsthExists != null){
    return res.status(400).json({ error: 'Já existe uma leitura para este tipo no mês atual' });
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

    const queryText1 = 'INSERT INTO customers(customer_code) VALUES($1)';
    const values1 = [customer_code];
    await pool.query(queryText1, values1);

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
    const resultado = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      { text: "Qual o numero em destaque na imagem (responda apenas o numero)?" },
    ]);

    // Output the generated text to the console
    const measure_value = resultado.response.text()
    const image_url = generateTemporaryLink(outputPath)
    const measure_uuid = uuidv4();

    const query = 'SELECT id FROM customers WHERE customer_code = $1';
    const value = [customer_code];
    const id_do_customer = pool.query(query, value);

    const queryText = 'INSERT INTO measures(measure_uuid, customer_id, measure_datetime, measure_type, has_confirmed, image_url) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [measure_uuid, id_do_customer, measure_datetime, measure_type, false, image_url];

    await pool.query(queryText, values);

    return res.status(200).json({
      message: 'Operação realizada com sucesso',
      data: {
        measure_value,
        image_url,
        measure_uuid
    }
  });

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