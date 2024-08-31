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
exports.confirmImage = confirmImage;
const db_1 = require("../db");
function confirmImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { measure_uuid, confirmed_value } = req.body;
            if (typeof measure_uuid != 'string' || typeof confirmed_value != 'number') {
                return res.status(400).json({ error: 'Os dados fornecidos no corpo da requisição são inválidos' });
            }
            const checkMeasureQuery = 'SELECT has_confirmed FROM measures WHERE measure_uuid = $1';
            const measureResult = yield db_1.pool.query(checkMeasureQuery, [measure_uuid]);
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
            yield db_1.pool.query(updateMeasureQuery, [measure_uuid, confirmed_value]);
            return res.status(200).json({
                message: 'Operação realizada com sucesso',
                data: {
                    measure_uuid,
                    confirmed_value
                }
            });
        }
        catch (error) {
            console.error('Erro ao confirmar a leitura:', error);
            return res.status(500).json({ error: 'Erro interno ao confirmar a leitura.' });
        }
    });
}
