import { Router } from "express";
import passport from "passport";
import { logger } from "../utils/initData.js";

export const userRouter = Router();

userRouter.post(
    '/login',
    passport.authenticate('login', { failureRedirect: '/faillogin' }),
    async (req, res) => {
        logger.info('POST /API/USUARIO/login');
        const { username } = req.body;
        req.session.username = username;
        req.session.login = 'logged';

        res.redirect('/');
    }
);

userRouter.post(
    '/register',
    passport.authenticate('signup', { failureRedirect: '/failregister' }),
    async (req, res) => {
        logger.info('POST API/USUARIO/register');
        const { username, firstName, lastName } = req.body;

        req.session.username = username;
        req.session.firstName = firstName;
        req.session.lastName = lastName;

        res.redirect('/');
    }
)