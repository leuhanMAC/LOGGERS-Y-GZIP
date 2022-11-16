import { Router } from "express";
import { logger } from "../utils/initData";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const products = await productFiles.getAll();
    logger.info('GET PRODUCTOS/');
    res.render("productList", {
        products,
        emptyProducts: !Boolean(products.length)
    })
});

productRouter.post(
    "/",
    async (req, res) => {
        const { title, price, thumbnail } = req.body;
        logger.info('POST PRODUCTOS/');

        await productFiles.save({
            title,
            price,
            thumbnail,
        });
        res.redirect("/");
    }
);