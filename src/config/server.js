require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cookie = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const SECRET_KEY = process.env.SECRET_KEY || "ecomus";
const CLIENT_URL = process.env.CLIENT_URL || "https://goos-frontend.vercel.app";
const CLIENT_ADMIN_URL =
    process.env.CLIENT_ADMIN_URL || "https://goos-admin.vercel.app/";
const init = () => {
    const app = express();
    app.use(
        cors({
            origin: ["*"],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.urlencoded({ extended: false }));
    app.use(
        session({
            secret: SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, maxAge: 30000000 },
        })
    );

    return app;
};

module.exports = { init };
