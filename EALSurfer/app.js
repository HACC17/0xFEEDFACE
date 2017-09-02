var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("<h1>HACC2017 0xFEEDFACE landing page.");
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running...")
});