import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getAllUser, getUserByID } from "../controllers/userController.js";
 

const userRouter = express.Router();

// get single user 
userRouter.get("/get-user/:id"   , getUserByID)

// get all user 

userRouter.get("/get-all" , getAllUser)





export default userRouter;
