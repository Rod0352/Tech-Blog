const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// const dotenv = require('dotenv').config({path:'./.env'})
const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection.js");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'sess',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 1000 * 60 * 10, // will check every 10 minutes
      expiration: 1000 * 60 * 30 // will expire after 30 minutes
  })
};

app.use(session(sess));

const hbs = exphbs.create({
  helpers: {
    format_date: date => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(require('./controllers/'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  sequelize.sync({ force: true });
});
