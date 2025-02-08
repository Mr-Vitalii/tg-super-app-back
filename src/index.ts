import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import TelegramBot from "node-telegram-bot-api";

import mongoose from "mongoose";

const tgToken: string = process.env.TG_BOT_TOKEN as string
 
const webAppUrl = "https://tg-super-app.netlify.app/";

import userRoutes from "./routes/users";

mongoose
  .connect(process.env.DB_HOST as string)
  .then(() => console.log("Connected to database!"));

 

const app = express();
app.use(express.json());
app.use(cors());



const bot = new TelegramBot(tgToken, {polling: true});


app.use("/api/users", userRoutes);

app.post('/api/users/register-telegram', (req: Request, res: Response) => {
    console.log('Полученные данные:', req.body);
    res.json({ message: 'Запрос успешно обработан', data: req.body });
});


bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;


  //* Кнопка которая в самом низу телеграм бота
  if (text === '/start') {

    //* Кнопка которая появляется ниже приходящего сообщением 'Заходи в наш интернет магазин по кнопке ниже'
    await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Посетить магазин', web_app: { url: webAppUrl } }]
        ]
      }
    })
  }

  //* Обработка кнопки "Войти через Телеграм"
    if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      console.log(data)
      await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
     /*  await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
      await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street); */

      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
      }, 3000)
    } catch (e) {
      console.log(e);
    }
  }
});








app.get("/test", async (req: Request, res: Response) => {
res. json({ message: "Hello!" });
});

app.listen (7001, () => {
console. log("server started on localhost:7001");
}) ;