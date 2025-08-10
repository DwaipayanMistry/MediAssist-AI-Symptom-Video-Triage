import { timeStamp } from "console";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.get("/", (req: Request, res: Response) => {
  res.json("Hello, TypeScript + Express!");
});
app.get('/health',(req:Request, res:Response)=>{
  res.json({
    status:'ok',
    message:"Server is running smoothly",
    timeStamp:new Date().toDateString(),
    uptime:process.uptime()
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
