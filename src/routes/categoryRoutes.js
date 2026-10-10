import { Router } from "express";
import { getAllCategories, getOneCategory, createCategory, updateCategory} from "../controllers/CategoryController.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getOneCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);

export default router;