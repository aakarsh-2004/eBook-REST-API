import express from "express";
import { createBook } from "../../controllers/book/bookController";
import multer from "multer";
import path from "path";
import authenticate from "../../middlewares/authenticate";

const bookRouter = express.Router();

// file store local (multer is a middleware to handle files)
const upload = multer({
    dest: path.resolve(__dirname, '../../../public/data/uploads'),
    limits: {fileSize: 3e7} // 30mb
})

// routes
bookRouter.post(
    '/', 
    authenticate,
    upload.fields([
        {name: 'coverimage', maxCount: 1},
        {name: 'file', maxCount: 1},
    ]), 
createBook);

export default bookRouter;


