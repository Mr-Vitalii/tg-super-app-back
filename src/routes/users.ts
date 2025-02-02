import express from "express";
import * as ctrl from "../controllers/user";


const router = express.Router();


router.post("/register",  ctrl.register);

export default router;