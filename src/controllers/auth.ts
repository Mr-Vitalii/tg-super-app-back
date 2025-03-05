
import { Request, Response } from "express";



export const registerTg = async (req: Request, res: Response) => {
     try {

    console.log("Получены данные пользователя:", req.body);

    res.json({ message: "Успешная авторизация", userData: req.body });
  } catch (error:any) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
 }