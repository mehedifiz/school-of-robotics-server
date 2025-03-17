import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getUserByID } from "../controllers/userController.js";
 

const userRouter = express.Router();


userRouter.get("/get-user/:id" ,  auth('student', "admin") , getUserByID)






export default userRouter;
