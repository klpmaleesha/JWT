require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
require("./configs/db.config").connect();

const authRoutes = require("./routes/auth.route");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8800;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

server.listen(port, () => {
  console.log(`Server is listing on http://localhost:${port}`);
});
