import { chat, productFiles, args } from "../utils/initData.js";
import { Router } from "express";
import { cpus } from 'os';

export const mainRouter = Router();

mainRouter.get("/", async (req, res) => {
    const products = await productFiles.getAll();
    const messages = await chat.getAll();
    const username = req.session.username || '';

    res.render("homepage", {
        username,
        products,
        messages,
        emptyProducts: !Boolean(products.length),
    });
});

mainRouter.get("/chat", async (req, res) => {
    const messages = await chat.getAll();
    const username = req.session.username || '';

    res.render("chat", {
        messages,
        username
    });
});

mainRouter.get("/info", async (req, res) => {

    const info = {
        inputArgs: JSON.stringify(args, null, 3),
        plataformName: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage().rss + ' Bytes',
        executionPath: process.title,
        numCPUS: cpus().length,
        processID: process.pid,
        projectFolder: process.cwd()
    }
    const username = req.session.username || '';

    res.render("info", { info, username });
});

mainRouter.get("/api/productos", async (req, res) => {
    const products = await productFiles.getAll();
    res.json(products);
    res.end();
});

mainRouter.get("/register", async (req, res) => {
    res.render("register");
});
mainRouter.get("/login", async (req, res) => {
    res.render("login");
});

mainRouter.get("/faillogin", async (req, res) => {
    res.render("errorLogin");
});

mainRouter.get("/failregister", async (req, res) => {
    res.render("errorRegister");
})

mainRouter.get("/logout", async (req, res) => {

    req.session.destroy(
        (err) => {
            if (err) {
                res.json(err);
            } else {
                res.redirect('/');
            }
        }
    )
});