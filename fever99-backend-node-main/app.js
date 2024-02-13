import express from "express";
import route from "./src/Route/index.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import responseHandler from "./src/ResponseHandlar/ResponseHandlar.js";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import {DecryptData, initiateWalletRecharge, ccAvenueRequestHandler, ccAvenueResponseHandler} from "./src/Controller/CCAvenueController.js"
import { sendNotificationBefore } from "./src/Controller/userController.js";  
// let MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/initialdb'
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// console.log(dotenv.parse);


app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(express.static("uploads"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found");
    }
  });
});

function scheduleNotification() {
  const delay = 5000;

  const intervalId = setInterval(() => {
      sendNotificationBefore();
      // clearInterval(intervalId);
  }, delay);
}

// scheduleNotification()

app.post("/api/handle-response", DecryptData);

app.get("/api/initiateWalletRecharge", initiateWalletRecharge)

app.post("/api/ccAvenueRequestHandler", ccAvenueRequestHandler)

app.post("/api/ccAvenueResponseHandler", ccAvenueResponseHandler)


const allowedOrigins = [
  "http://localhost:3000",
  "https://fever99.com",
  "https://www.fever99.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  console.log('connect detabase')
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  });
}

app.use("/api", route);
app.use(responseHandler);

let server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("message", (data) => {
    io.emit(data.toUserId, { message: data.message, type: data.type, toUserId: data.toUserId, userId: data.userId });
  });

  socket.on("leave", () => {
  });
});