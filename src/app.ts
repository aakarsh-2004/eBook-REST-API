import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/user/userRouter";
import bookRouter from "./routes/book/bookRouter";

const app = express();

app.use(express.json());

// Routes
app.get('/api', (req, res, next) => {
    const error = createHttpError(400, "something went wrong");
    throw error;

})


// global error handler
app.use(globalErrorHandler);


// user routes
app.use('/api/users', userRouter);

// book routes
app.use('/api/books', bookRouter);

export default app;