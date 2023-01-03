const express = require("express");
const exphbs = require("express-handlebars");


require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
// app.use(express.static('public'));
console.log(__dirname);
app.use("/public", express.static(__dirname + "/public"));

app.use(cors());


// Templating Engine
const handlebars = exphbs.create({
	extname: ".hbs",
	helpers: {
		dateFormat: require("handlebars-dateformat"),
		isEqual : function (expectedValue, value) {
    return value === expectedValue;
  }
	},
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");



const clientRoutes = require("./server/routes/client");
const commandeRoutes = require("./server/routes/commande");

app.use("/", clientRoutes);
app.use("/", commandeRoutes);


// app.get('', (req,res) =>{ res.render('home');});

app.listen(port, () => console.log(`Listening on port ${port}`));
