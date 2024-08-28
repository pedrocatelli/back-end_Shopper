import express from 'express';
import bodyParser from 'body-parser';
import minhasRotas from './routes/projectRoutes';
import path from 'path';

const uploadsDir = path.join(__dirname, '../uploads');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', minhasRotas);

app.use('/uploads', express.static(uploadsDir));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
