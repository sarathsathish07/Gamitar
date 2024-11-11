import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getGrid,
  updateGrid,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/grid", getGrid);
router.put("/grid/update", protect, updateGrid);
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

export default router;
