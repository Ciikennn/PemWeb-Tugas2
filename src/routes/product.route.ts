import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
