require("dotenv").config();
const PORT = process.env.PORT;

const app = require("./config/server").init();
const router = require("./routers");
const db = require("./config/database");

db.connect();

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
