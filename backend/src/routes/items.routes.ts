import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Get items (stub)
 *     description: Reads data from DB (later)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", (_req, res) => {
  res.json({ items: [] });
});

export default router;
