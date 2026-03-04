import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Publish event (stub)
 *     description: Sends event to EventBridge (later)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               payload:
 *                 type: object
 *             required: [type, payload]
 *     responses:
 *       202:
 *         description: Accepted
 */
router.post("/", (_req, res) => {
  res.status(202).json({ status: "accepted" });
});

export default router;
