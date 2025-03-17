import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;


app.use(cors()
);
app.use(express.json()); 

connectDB()

app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);


app.get("/", async (req, res) => {
	res.send("server is running on port: " + port);
});

app.listen(port, () => console.log("My server is running on port:", port));
