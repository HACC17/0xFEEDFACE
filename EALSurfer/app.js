var express = require("express");
var app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");

var chemRef;
var chemRefProcessor = function(XLSXFile){
    //Read chemcial reference sheets
    //save to chemRef
}

chemRefProcessor();

//navigation
app.get("/", function(req, res){
    res.send("<h1>HACC2017 0xFEEDFACE landing page.</h1><p>Expect great things.</p>");
});

app.get("/form", function(req, res){
    //stringify chem ref and send it to client
    res.render("form")
});

app.get("/admin", function(req, res){
   
   res.render("admin"); 
});

app.get("/report/:data", function(req, res){
    var rawFormData = req.params.data;
    var formData = JSON.parse(rawFormData);
    console.log(formData);
    res.send("<h1>Your form is available at:</h1>");
});

/******************************************************************************
* For later...                                                                *
*******************************************************************************/

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

app.post("/uploads", function(req, res){
    //upload new spread sheet file
    
    //process file and create chemical reference JSON
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running...")
});