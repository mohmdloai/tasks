import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { create, list, getById, update, remove } from "../controllers/task.controller";

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.post("/", create);
router.get("/", list);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
