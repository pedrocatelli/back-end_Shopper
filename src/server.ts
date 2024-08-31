import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import medidorRotas from './routes/projectRoutes';

const app = express();
const port = process.env.PORT || 3000;

import dotenv from 'dotenv';
dotenv.config();

app.use(bodyParser.json());

app.use(medidorRotas);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});