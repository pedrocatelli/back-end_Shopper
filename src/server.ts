import express from 'express';
import bodyParser from 'body-parser';
import medidorRotas from './routes/projectRoutes';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(bodyParser.json());

app.use(medidorRotas);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});