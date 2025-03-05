import express from "express";
import * as ctrl from "../controllers/auth";


const router = express.Router();


router.post("/register",  ctrl.registerTg);

export default router;