require("dotenv").config({
  path:
    process.env.NODE_ENV === "development"
      ? ".env.development"
      : ".env.production",
});
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const cookieParser = require("cookie-parser");
const session = require("express-session");
require("express-async-errors");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const { APP_PORT } = require("./utils/ports");
const { handlerError } = require("./error/error.helper");
const { authRoute } = require("./routes/auth.route");
const { taskRoute } = require("./routes/task.route");
const { authorizedUser } = require("./middleware/auth.middleware");
const { listRoute } = require("./routes/list.route");
const { boardRoute } = require("./routes/board.route");
const app = express();

process.on('uncaughtException', function (err) {       
  console.log(err);
  //Send some notification about the error  
  process.exit(1);
});
console.log('llllll///////////////////');
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:8080", // or this could be a specific list or match patterns
  credentials: true, // Allow cookies and credentials to be sent along
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(session({
  secret: 'my_secret',
}))
app.use(cookieParser()); // This will parse cookies from incoming requests
app.use(morgan('dev'))
app.use("/auth", authRoute);
app.use("/users", authorizedUser, userRoute);
app.use("/lists", authorizedUser, listRoute);
app.use("/board", authorizedUser, boardRoute);
app.use("/tasks", authorizedUser, taskRoute);
app.use(handlerError);

app.listen(APP_PORT, () => {
console.log('llllll///////////////////');

  console.log("CONNECTED ON PORT:", APP_PORT);
});
