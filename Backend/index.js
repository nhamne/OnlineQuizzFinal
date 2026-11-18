const express = require("express");
const authRouter = require("./src/routes/auth.route");

const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
