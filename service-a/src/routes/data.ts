import { Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

const router = Router();

router.get("/data", async (req, res) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

export default router;
