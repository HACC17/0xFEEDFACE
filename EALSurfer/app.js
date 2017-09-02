var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.send("<h1>HACC2017 0xFEEDFACE landing page.");
});

app.get("/Form", function(req, res){
    res.render("form")
});

app.get("/java/:statement", function(req, res){
   var statement = req.params.statement;
// Instantiate a java class and call methods, not working need a jar
  // var jobj = Packages.com.hacc2017.hello(statement);
  // statement = jobj.repeatBack();
   res.render("java", {statement: statement});
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running...")
});