const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("./middleware/csrf");
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser("notverysecret"));
app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}
const csrf_options = {
  protected_operations: ["PATCH"],
  protected_datatypes: ["application/json"],
  development_mode: csrf_development_mode,
};

app.use(csrf(csrf_options));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/report", (req, res) => {
  res.render("report", { input_1: req.body.input_1 });
});
app.get("/fail", (req, res) => {
  res.render("fail");
});
app.get("/succeed", (req, res) => {
  res.render("succeed");
});

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
