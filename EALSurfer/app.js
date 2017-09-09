var express = require("express"); //framework
var XLSX = require("xlsx"); //for processing excel files
var app = express();


app.use(express.static("public")); //point express to public folder
app.set("view engine", "ejs"); //use embedded java script

/*
chemRefList : a place to store chemical sepcific data from excel file.
*/
var chemRefList = []; 
/*
chemList : a place to store name of chemicals. Used to populate the EAL Surfer
form 'Chemical' select input.
*/
var chemList = [];
/*
chemRefProcessor : a function which takes a EAL Surfer .xlsx file and pulls out
the data necessary to display to the end user. **This is not for processsing
the EAL Surfer form. That is done with Java.
*/
var chemRefProcessor = function(XLSXFile){
    var workbook = XLSX.readFile(XLSXFile);
    var worksheet1 = workbook.Sheets[workbook.SheetNames[9]]; //Summary Table A (Soil & GW)
    var worksheet2 = workbook.Sheets[workbook.SheetNames[10]]; //Summary Table B (Soil & GW)
    var worksheet3 = workbook.Sheets[workbook.SheetNames[11]]; //Summary Table C (IA & Soil Vap)
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
            worksheet2['E' + i].v,
            worksheet3['F' + i].v,
            worksheet3['G' + i].v
            ]
        };
        chemRefList.push( chemical );
        chemList.push("<option>"+chemical.chemical+"</option>");
    }
};
/*
Get necessary data for client end.
*/
chemRefProcessor("public/uploads/master_spreadsheet_files/test.xlsx");


app.get("/", function(req, res){
    res.send("<h1>HACC2017 0xFEEDFACE landing page.</h1><p>Expect great things.</p>");
});

app.get("/form", function(req, res){
    var chemicals = JSON.stringify(chemList);
    res.render("form", {chemList : chemicals});
});

app.get("/chemlist", function(req, res){
    var chemicals = JSON.stringify(chemList);
    res.send(chemList);
});

app.get("/instructions", function(req, res){
   res.render("instructions"); 
});

app.get("/admin", function(req, res){
   res.render("admin"); 
});

app.get("/submit/:data", function(req, res){
    var rawFormData = req.params.data;
    var formData = JSON.parse(rawFormData);
    console.log(formData);
});

app.get("/eal_spreadsheet", function(req, res){
   res.render("eal_spreadsheet"); 
});

app.get("/download", function(req, res){
   var path = "public/uploads/master_spreadsheet_files/test.xlsx";
   res.download(path, "EALSurfer.xlsx"); 
});

app.get("/chemdata/:index/:drinking/:distance/:use", function(req, res){
    var i = req.params.index;
    var drinking = req.params.drinking;
    var distance = req.params.distance;
    var use = req.params.use;
    if(chemRefList[i].ealdata[8+1*use]) use = chemRefList[i].ealdata[8+1*use].toExponential(1);
    else use = 'NA';
    var specificChemicalData = 
    "<p style='text-align: right'>"+ chemRefList[i].ealdata[4*drinking+2*distance].toExponential(1) +
    "</p><p style='text-align: right'>"+ chemRefList[i].ealdata[4*drinking+2*distance+1].toExponential(1) +
    "</p><p style='text-align: right'>"+ use +"</p>";
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