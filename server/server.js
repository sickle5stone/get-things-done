const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json())
const port = 3002;
const TelegramBot = require("node-telegram-bot-api");
const { Client } = require("pg");


// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Initialize Postgres connection
// const client = new Client({
//   database: "tasks",
//   user: "postgres",
//   password: "postgres",
// });

// Local State Truths
let addingText = false;
let addingTextValue = "";

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.

const connectAndQuery = async (query, parameters = []) => {
  const client = new Client({
    database: "tasks",
    user: "postgres",
    password: "postgres",
  });
  // console.log(client._connected);
  // TOFIX
  // if (!client._connected) {
  await client.connect();
  // }
  // if (client._connected) {
  const res = await client.query(query, parameters);
  await client.end();
  return res.rows;
  // }
  // console.log(query);
  // console.log(res);
  // console.log(res.rows[0]); // Hello world!
  // End PG Query
  // client.connect((err) => {
  //   if (err) {
  //     console.error('connection error', err.stack)
  //   } else {
  //     console.log('connected')
  //   }
  // })
};

bot.onText(/\/tasks/, (msg, match) => {
  const chatId = msg.chat.id;

  connectAndQuery("SELECT * FROM public.tasks").then((res) => {
    bot.sendMessage(chatId, `Received data: ${JSON.stringify(res, null, 4)}`);
  });
});

bot.onText(/\/add (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  // console.log(match[1]);
  addingText = true;
  addingTextValue = match[1];
  const storeMessage = bot.sendMessage(
    chatId,
    `Are you adding \n\n "<i>${match[1]}</i>"`,
    {
      reply_markup: {
        keyboard: [["Yes", "No"]],
      },
    }
  );

  // storeMessage.then(console.log);
  // storeMessage.then((msg) => bot.deleteMessage(msg.chat.id, msg.message_id));
  // TODO: need to introduce map and index based on user id

  // connectAndQuery("INSERT INTO public.tasks (name) VALUES ('CDE')").then(() => {
  //   bot.sendMessage(chatId, );
  // });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // console.log(msg.text.indexOf("Yes"), msg.text.indexOf("No"));
  // console.log(msg);

  if (msg.text.indexOf("Yes") === 0 && addingText) {
    bot.deleteMessage(msg.chat.id, msg.message_id - 2);
    bot.deleteMessage(msg.chat.id, msg.message_id - 1);
    bot.deleteMessage(msg.chat.id, msg.message_id);
    connectAndQuery(
      `INSERT INTO public.tasks (task) VALUES ('${addingTextValue}')`
    ).then(() => {
      bot.sendMessage(chatId, `Added the task: ${addingTextValue}`);
      addingText = false;
      addingTextValue = "";
    });
  }

  if (msg.text.indexOf("No") === 0 && addingText) {
    bot.deleteMessage(msg.chat.id, msg.message_id - 2);
    bot.deleteMessage(msg.chat.id, msg.message_id - 1);
    bot.deleteMessage(msg.chat.id, msg.message_id);
    addingText = false;
    addingTextValue = "";
  }

  //   bot.sendMessage(chatId, msg);
  //   const res = await client.query("SELECT $1::text as message", [
  //     "Hello world!",
  //   ]);
  //   console.log(res.rows[0].message); // Hello world!
  //   await client.end();
  // debugger;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, "Received your message");
});

app.get("/tasks", (req, res) => {
  connectAndQuery("SELECT * FROM public.tasks").then((data) => {
    res.send(data);
  });
});

// app.get("/count", (req, res) => {
//   connectAndQuery("COUNT distinct(*) FROM public.tasks").then(console.log);
// })

app.post('/delete', (req, res) => {
  connectAndQuery("DELETE FROM public.tasks WHERE id = $1", [req.body.id]).then((data) => {
    console.log(data);
    // });
    // connectAndQuery("SELECT * FROM public.tasks WHERE id = $1 ", [req.body.id]).then((data) => {
    res.send(data);
  });
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
