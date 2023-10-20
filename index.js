const express = require("express");
const cors = require("cors");
const axios = require("axios");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { connection } = require("./db");
const { productRouter } = require("./Controller/ProductRouter");
const { AuthModel } = require("./Model/authModel");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const { apiRouter } = require("./Controller/ApiRouter");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//passport.js
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  AuthModel.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      AuthModel.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            const newUser = new AuthModel({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });

            newUser
              .save()
              .then((user) => {
                done(null, user);
              })
              .catch((err) => {
                done(err);
              });
          }
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("http://localhost:3000/home");
  }
);



app.use("/api", apiRouter)
app.use("/product", productRouter);



app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("mongoDB connected");
  } catch (err) {
    console.log(err);
    console.log("mongoDB not connected");
  }
  console.log(`server is running on port ${process.env.port}`);
});
