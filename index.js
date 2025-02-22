const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const app = express();

app.use(express.json());

// swagger documentation
const swaggerDoc = yaml.load("./swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.username == null) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(process.env.PORT || PORT, () => console.log("Server is running"));
