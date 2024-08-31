// src/db.ts
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
  user: "pedro_catelli",
  host: "10.160.222.11",
  database: "shopper",
  password: "senha",
  port: 5432,
});

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};