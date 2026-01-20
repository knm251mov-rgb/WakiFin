const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routers/user');
const pageRouter = require("./routers/page");
const authRouter = require("./routers/auth");
const { port, host, mongoURL } = require('./configuration/index');

const app = express();

// ✅ CORS налаштування
app.use(cors({
  origin: '*', // Дозволити всім
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Маршрути
app.use('/users', userRouter);
app.use("/pages", pageRouter);
app.use("/auth", authRouter);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

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
