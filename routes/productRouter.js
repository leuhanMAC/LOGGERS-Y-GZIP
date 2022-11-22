import { Router } from "express";
import { logger, productFiles } from "../utils/initData.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
    logger.info('GET /productos');
    let products;
    try {
        products = await productFiles.getAll();
    } catch (error) {
        logger.error(`Error to get products: ${error}`);
    }

    res.render("productList", {
        products,
        emptyProducts: !Boolean(products.length)
    })
});

productRouter.post(
    "/",
    async (req, res) => {
        logger.info('POST /productos');
        const { title, price, thumbnail } = req.body;
        try {
            await productFiles.save({
                title,
                price,
                thumbnail,
            });
        } catch (error) {
            logger.error(`Error to save product: ${error}`);
        }

        res.redirect("/");
    }
);