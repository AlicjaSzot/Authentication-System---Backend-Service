import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //1. szukamy tokena w nagłówku Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //2. jesli brak tokena -> 401
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  //3. weryfikujemy token
  try {
    const secret = process.env.JWT_ACCESS_SECRET || "fallback-access-secret";
    const decoded = jwt.verify(token, secret);

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
