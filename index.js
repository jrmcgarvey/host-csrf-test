const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser("notverysecret"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}
const csrf_options = {
  protected_operations: ["PATCH"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
};

app.use((req,res,next)=>{
  console.log("req.method", req.method)
  console.log("req.body",req.body)
  console.log("req.headers",req.headers)
  next();
})

app.use(csrf(csrf_options));

app.get("/CSRFToken",(req,res)=>{
  csrfToken=csrf.refresh(req,res)
  console.log(csrfToken)
  res.json({csrfToken})
})
app.get("/currenttoken", (req,res)=> {
  console.log("token", csrf.token(req,res))
  res.json({csrfToken: csrf.token(req,res)})
})
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/report", (req, res) => {
  console.log("here!!")
  console.log(req.body)
  if (req.headers["content-type"]== "application/json") {
    return res.redirect("/")
  }
  res.render("report", { input_1: req.body.input_1 });
});
app.get("/fail", (req, res) => {
  res.render("fail");
});
app.get("/succeed", (req, res) => {
  res.render("succeed");
});
app.get("/succeed2", (req, res) => {
  res.render("succeed2");
});
app.get("/succeed3", (req, res) => {
  res.render("succeed3");
});
app.get("/refresh", (req,res) => {
  csrf.refresh(req,res);
  res.redirect("/");
})
app.use((err, req,res,next)=> {
  console.log(err instanceof csrf.CSRFError)
  console.log(err.constructor.name)
  console.log(err)
  res.send(err.toString())
})

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
