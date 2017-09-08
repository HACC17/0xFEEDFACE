var express = require("express");
var XLSX = require("xlsx");
var app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");

var chemRefList = [];
var chemList = [];
var chemRefProcessor = function(XLSXFile){
    var workbook = XLSX.readFile(XLSXFile);
    var worksheet1 = workbook.Sheets[workbook.SheetNames[9]];
    var worksheet2 = workbook.Sheets[workbook.SheetNames[10]];
    for(var i = 5; i < 159; i++){
        var chemical = {
            "chemical" : worksheet1['A' + i].v,
            "ealdata" : [
            worksheet1['B' + i].v,
            worksheet1['C' + i].v,
            worksheet1['D' + i].v,
            worksheet1['E' + i].v,
            worksheet2['B' + i].v,
            worksheet2['C' + i].v,
            worksheet2['D' + i].v,
            worksheet2['E' + i].v
            ]
        };
        chemRefList.push( chemical );
        chemList.push("<option>"+chemical.chemical+"</option>");
    }
};

chemRefProcessor("public/uploads/master_spreadsheet_files/test.xlsx");

//navigation
app.get("/", function(req, res){
    res.send("<h1>HACC2017 0xFEEDFACE landing page.</h1><p>Expect great things.</p>");
});

app.get("/form", function(req, res){
    var chemicals = JSON.stringify(chemList);
    res.render("form", {chemList : chemicals});
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

app.get("/chemdata/:index/:drinking/:distance", function(req, res){
    var i = req.params.index;
    var drinking = req.params.drinking;
    var distance = req.params.distance;
    console.log(drinking + " " + distance);
    console.log(4*drinking+2*distance);
    console.log(chemRefList[i].ealdata[4*drinking+2*distance]);
    var specificChemicalData = 
    "<p style='text-align: right'>"+ chemRefList[i].ealdata[4*drinking+2*distance].toExponential(1) +
    "</p><p style='text-align: right'>"+ chemRefList[i].ealdata[4*drinking+2*distance+1].toExponential(1) +
    "</p><p style='text-align: right'>"+ "???" +"</p>";
    res.send(JSON.stringify(specificChemicalData));
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