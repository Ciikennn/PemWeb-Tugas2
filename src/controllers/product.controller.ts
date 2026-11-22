import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/HttpError";

const select = { id: true, name: true, price: true } as const;

const parseId = (value: unknown) => {
  const id = Number(value);
  if (value === undefined || value === null || value === "" || !Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "ID produk wajib diisi dan harus berupa bilangan bulat lebih dari 0");
  }
  return id;
};

// Validasi body POST (name, price). PUT memakai body yang sama + id.
const parseProductInput = (body: unknown) => {
  const { name, price } = (body ?? {}) as { name?: unknown; price?: unknown };

  if (typeof name !== "string" || name.trim() === "") {
    throw new HttpError(400, "Nama produk wajib diisi");
  }

  const priceNumber = Number(price);
  if (price === undefined || price === null || price === "" || !Number.isInteger(priceNumber) || priceNumber <= 0) {
    throw new HttpError(400, "Harga harus berupa bilangan bulat lebih dari 0");
  }

  return { name: name.trim(), price: priceNumber };
};

const ensureProductExists = async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id }, select });
  if (!product) {
    throw new HttpError(404, `Produk dengan id ${id} tidak ditemukan`);
  }
  return product;
};

// GET /api/products — menampilkan seluruh data
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" }, select });
  res.json({ status: true, message: "Berhasil mengambil data produk", data: products });
};

// POST /api/products — membuat data baru
// body: { "name": "Pulpen", "price": 5000 }
export const createProduct = async (req: Request, res: Response) => {
  const data = parseProductInput(req.body);
  const product = await prisma.product.create({ data, select });
  res.status(201).json({ status: true, message: "Produk berhasil ditambahkan", data: product });
};

// PUT /api/products — mengupdate data yang sudah ada
// body: { "id": 1, "name": "Pulpen Gel", "price": 7000 }
export const updateProduct = async (req: Request, res: Response) => {
  const id = parseId((req.body ?? {}).id);
  const data = parseProductInput(req.body);
  await ensureProductExists(id);

  const product = await prisma.product.update({ where: { id }, data, select });
  res.json({ status: true, message: "Produk berhasil diperbarui", data: product });
};

// DELETE /api/products/:id — menghapus data berdasarkan id
export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const product = await ensureProductExists(id);

  await prisma.product.delete({ where: { id } });
  res.json({ status: true, message: "Produk berhasil dihapus", data: product });
};
