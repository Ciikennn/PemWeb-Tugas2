import express from "express";
import { logger } from "./middlewares/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import productRoutes from "./routes/product.route";

const app = express();

app.use(logger);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: true, message: "Server berjalan dengan baik" });
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
