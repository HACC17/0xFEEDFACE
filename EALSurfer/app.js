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
    var error1;
    var error2;
    var exec = require('child_process').exec, child;
    child = exec('java -cp ~/workspace/0xFEEDFACE/EALSurfer/java/hello.jar com.hacc2017.hello',
        function (error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
             if(error !== null){
                console.log('exec error: ' + error);
    }
});



   res.render("java", {statement: statement});
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running...")
});