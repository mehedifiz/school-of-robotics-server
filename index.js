import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;


app.use(cors()
);
app.use(express.json()); 



app.get("/", async (req, res) => {
	res.send("server is running on port: " + port);
});

app.listen(port, () => console.log("My server is running on port:", port));
