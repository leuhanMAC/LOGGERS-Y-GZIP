import { Router } from "express";
import { fork } from 'child_process';
import { logger } from "../utils/initData.js";

export const randomRouter = Router();

randomRouter.get('/', async (req, res) => {
    logger.info('GET /api/randoms');

    const forkedRandom = fork('../utils/random.js');
    const username = req.session.username || '';


    forkedRandom.on('message', msg => {

        const cant = Number(req.query.cant) || 100000000;

        if (msg === 'init') {
            forkedRandom.send(cant);
        } else {
            const randomNumbers = { ...msg };
            delete randomNumbers[0];

            res.render("random",
                { randomNumbers, username }
            );

        }

    });

});