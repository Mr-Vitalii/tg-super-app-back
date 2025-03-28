
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express"

import TelegramBot from "node-telegram-bot-api";
import { WebDataRequest } from "./common/types/product";


const token : string = process.env.TG_BOT_TOKEN as string

const webAppUrl = "https://tg-super-app.netlify.app/"; //* Изменять перед оправкой в прод

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); */
app.use(cors());



bot.on("message", async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const text = msg.text;


  //* Кнопка которая в самом низу телеграм бота
  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму!!!', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заполнить форму!!', web_app: { url: webAppUrl + '/form' } }]
        ]
      }
    })

    //* Кнопка которая появляется ниже приходящего сообщением 'Заходи в наш интернет магазин по кнопке ниже'
    await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
        ]
      }
    })
  }


  //* принятие данных с фронтенда
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      console.log(data)
      await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
      await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
      await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
      }, 3000)
    } catch (e) {
      console.log(e);
    }
  }
});


//* app.use("/api/users", userRoutes);
app.post('/web-data', async (req, res) => {
  console.log(req.body);
 const { queryId, products = [], totalPrice }: WebDataRequest = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {
        message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
      }
    })
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({})
  }
})


app.get("/", (req, res) => {
  res.send("<h1>Hello, server ok</h1>");
});

app.post('/api/data', (req, res) => {
  const receivedData = req.body;
  
  res.json(receivedData);
});


import authRoutes from "./routes/auth";

app.use("/api/auth", authRoutes);

const PORT = 8001;

app.listen(PORT, () => {
  console.log("server running on localhost: " + PORT);
})