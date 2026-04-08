import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    //validation for register
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//=== LOGIN ===
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body;

    //validation for login
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    //Generate access and refresh tokens
    const accessSecret =
      process.env.JWT_ACCESS_SECRET || "fallback-access-secret";
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret";

    //uwtorzenie accessToken i refreshToken, oba zawierają te same dane (userId i email), ale różnią się czasem ważności i sekretem używanym do podpisu
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      accessSecret,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      refreshSecret,
      { expiresIn: "7d" },
    );

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    //ustawienie refresh token jako HTTOnly cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    //zwrócenie access token w odpowiedzi, refresh token jest przechowywany w cookie
    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/refresh", (req: Request, res: Response): void => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: "No refresh token provided" });
    return;
  }

  try {
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret";

    const decoded = jwt.verify(refreshToken, refreshSecret) as any;

    const accessSecret =
      process.env.JWT_ACCESS_SECRET || "fallback-access-secret";

    //generujemy nowy access token na podstawie danych z refresh tokena
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      accessSecret,
      { expiresIn: "15m" },
    );
    //odsyłamy access token na frontend, refresh token pozostaje bez zmian w cookie
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

//usuwanie refresh tokena z cookie podczas logoutu
router.post("/logout", (req: Request, res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!user) {
        res.status(404).json({ error: "user not found" });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
