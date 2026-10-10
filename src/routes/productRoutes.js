import { Router } from "express";
import { getAllProducts, getOneProducts } from "../controllers/productController.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getOneProducts);

export default router;