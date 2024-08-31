import { Request, Response } from 'express';
import { pool } from '../db';

export async function confirmImage(req: Request, res: Response) {
    try {
        const { measure_uuid, confirmed_value } = req.body;

        if (typeof measure_uuid != 'string' || typeof confirmed_value != 'number') {
            return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
        }

        const checkMeasureQuery = 'SELECT has_confirmed FROM measures WHERE measure_uuid = $1';
        const measureResult = await pool.query(checkMeasureQuery, [measure_uuid]);

        if (measureResult.rowCount == 0) {
            return res.status(404).json({ error: 'Leitura não encontrada' });
        }

        const measure = measureResult.rows[0];

        if (measure.has_confirmed) {
            return res.status(400).json({ error: 'Leitura já confirmada' });
        }

        const updateMeasureQuery = `
            UPDATE measures
            SET value = $2, has_confirmed = true
            WHERE measure_uuid = $1
        `;
        await pool.query(updateMeasureQuery, [measure_uuid, confirmed_value]);

        return res.status(200).json({
            message: 'Operação realizada com sucesso',
            data: {
                measure_uuid,
                confirmed_value
            }
        });
    } catch (error) {
        console.error('Erro ao confirmar a leitura:', error);
        return res.status(500).json({ error: 'Erro interno ao confirmar a leitura.' });
    }
}
