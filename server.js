import { createServer } from 'http';
import cluster from 'cluster';
import { cpus } from 'os';
import { engine } from "express-handlebars";
import { Server as IOServer } from 'socket.io';
import dotenv from 'dotenv';
import express, { json, urlencoded } from "express";
import mongoStore from 'connect-mongo';
import passport from "passport";
import session from 'express-session';
import compression from 'compression';


import './middlewares/passport/index.js';
import { productRouter } from './routes/productRouter.js';
import { userRouter } from './routes/userRouter.js';
import { randomRouter } from './routes/randomRouter.js';
import { mainRouter } from './routes/mainRouter.js';
import { chat, productFiles, args, logger } from './utils/initData.js';


const PORT = args.port;
const MODE = args.mode;

dotenv.config();
const app = express();
const httpServer = new createServer(app);
const io = new IOServer(httpServer);


//Handlebars
app.set("views", "./views");
app.set("view engine", "hbs");

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
    })
);

// GZIP
app.use(compression());

//Session
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            options: {
                userNewParser: true,
                useUnifiedTopology: true
            }
        }),
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 600000 }
    })
);

// JSON
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

//Passport
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/", mainRouter);
app.use("/productos", productRouter);
app.use("/api/usuario", userRouter);
app.use("/api/randoms", randomRouter);

//404
app.use(function (req, res) {

    logger.warn(`404 ${req.url} NOT FOUND`);
    res.status(404).send('404 Page Not found').end();
});

//SocketIO
io.on("connection", async (socket) => {
    logger.info('New connection on socket');
    socket.on("add-product-server", async (data) => {
        try {
            await productFiles.save(data);
            io.emit("add-product-client", data);
            logger.info('New product added.');
        } catch (error) {
            logger.error(`ERROR ON SAVE PRODUCT: ${error}`);
        }

    });

    socket.on("add-message-server", async (data) => {
        try {
            await chat.save(data);
            io.emit("add-message-client", data);
            logger.info('New message added.');
        } catch (error) {
            logger.error(`ERROR ON SEND MESSAGE: ${error}`);
        }

    })
});

if (MODE.toLowerCase() === 'cluster') {
    if (cluster.isPrimary) {
        console.log(`Master ${process.pid} is running`);

        for (let i = 0; i < cpus().length; i++) {
            cluster.fork();

        }

        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} DIED`);
        })

    } else {

        httpServer.listen(PORT, () => {
            console.log(`SERVER ON, MODE: ${MODE}, PORT: ${PORT}`);
        });
    }

} else {
    httpServer.listen(PORT, () => {
        console.log(`SERVER ON, MODE: ${MODE}, PORT: ${PORT}`);
    });
}