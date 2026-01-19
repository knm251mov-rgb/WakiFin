const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routers/user');
const pageRouter = require("./routers/page");
const authRouter = require("./routers/auth");
const { port, host, mongoURL } = require('./configuration/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use("/pages", pageRouter);
app.use("/auth", authRouter);


const startServer = () => {
  app.listen(port, host, () => {
    console.log(`Server is available on http://${host}:${port}`);
  });
};

if (require.main === module) {
  mongoose.connect(mongoURL);
  mongoose.connection
    .on('error', (error) => console.log(error.message))
    .once('open', () => startServer());
}

module.exports = { app, startServer };
