import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));

app.use(cors());

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));


app.listen(PORT,()=>{console.log(`process ID ${process.pid}:server running on PORT ${PORT} in dev mode`);})
