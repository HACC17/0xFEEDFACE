var express = require('express'); //framework
var app = express();
var XLSX = require('xlsx'); //for processing excel files
var qs = require('qs');

const PDFMerge = require('pdf-merge');
const { exec } = require('child_process');

app.use(express.static("public")); //point express to public folder
app.set("view engine", "ejs"); //use embedded java script

/*
chemRefList : a place to store chemical sepcific data from excel file.
*/
var chemRefList = []; 
/*
chemList : a place to store name of chemicals. Used for dynamic population of the 
EAL Surfer form 'Chemical' select input.
*/
var chemList = [];

/***************
 * ROUTES ==>  *
 * ************/

app.get("/", function(req, res){
    var chemicals = JSON.stringify(chemList);
    res.render("form", {chemList : chemicals});
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

app.get("/eal_spreadsheet", function(req, res){
   res.render("eal_spreadsheet"); 
});

app.get("/master_file", function(req, res){
   res.download("public/uploads/master_spreadsheet_files/HEER_EAL_Surfer_FULL_VERSION_HDOH_Summer_2016rev_Jan_2017.xlsx", "HEER_EAL_Surfer_FULL_VERSION_HDOH_Summer_2016rev_Jan_2017.xlsx"); 
});

app.get("/download/:userFilePath", function(req, res){
    var fileName = req.param.userFilePath;
    res.download("public/clientpdfs/"+fileName, fileName)
});

app.get("/glossary", function(req, res){
    res.render("glossary");
});

app.get("/updates", function(req, res){
    res.render("updates");
});

app.get("/submit/:data", function(req, res){
    console.log("Form submission:");
    var rawFormData = req.params.data;
    var FormData = qs.parse(rawFormData);
    var fileNames = [];
    var finalPDFNAME = ""+ FormData.reportOrder[0].sheet4.D4.replace(/\s+/g, '') + FormData.reportOrder[0].sheet4.D9.replace(/\s+/g, '') + ".pdf";
    for(var i =0; i < FormData.reportOrder.length; i++){
        fileNames.push(FormData.reportOrder[i].sheet4.D4 + "_" + FormData.reportOrder[i].sheet2.C16 + "_" + FormData.reportOrder[i].sheet4.D9 +".xlsx"); 
    };
    var forJava = "'" + JSON.stringify(FormData.reportOrder) + "'";
    processForm(forJava, fileNames, finalPDFNAME).then(function(result) { //see function processForm below
        console.log(result);
        res.render("download", {downloadLink : "/download/" + finalPDFNAME});
        }, function(err) {
        console.log(err); 
        res.render("error");
    });
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

app.post("/uploads", function(req, res){
    //upload new spread sheet file
    
    //process file and create chemical reference JSON
});

/******************************************************************************
 * *********** Excell processing and pdf creation functions *******************
 * ***************************************************************************/

/*****************************************************************************
* @processForm Calls the xcelreader.jar with client form data as argument, if 
* that promise resolves, another new promise is made with executing libreoffice 
* pdf convert */

var processForm = function (forJava, fileNames, finalPDFNAME) {
    return new Promise(function(resolve, reject) {
        console.log(fileNames);
        exec('java -jar ~/workspace/0xFEEDFACE/xcelreader/out/artifacts/xcelreader_jar/xcelreader.jar '  + forJava, (err, stdout, stderr) => {
            if(stdout==0){
                resolve(new Promise( function(resolve, reject) {
                    var header = "libreoffice --headless --convert-to pdf  ~/workspace/0xFEEDFACE/EALSurfer/public/clientxlsx/";
                    var footer = " --outdir ~/workspace/0xFEEDFACE/EALSurfer/public/clientpdfs";
                    var convertCommand = "";
                    for(var i = 0; i < fileNames.length; i++){
                        if(i == fileNames.length-1) convertCommand += header + fileNames[i] + footer;
                        else convertCommand += header + fileNames[i] + footer + " ; ";
                    }
                    console.log(convertCommand);
                    exec(convertCommand, (err, stdout, stderr) => {
                    if(err !== null) {
                        console.log(stdout);
                        console.log(stderr);
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(new Promise( function(resolve, reject){
                        for(var i = 0; i <fileNames.length; i++){
                            fileNames[i] = "~/workspace/0xFEEDFACE/EALSurfer/public/clientpdfs/" + fileNames[i].replace('xlsx', 'pdf');
                        }
                        if(fileNames.length > 1){
                            var mergeCommand = "pdftk";
                            for(var i = 0; i < fileNames.length; i++){
                                mergeCommand += " " + fileNames[i];
                            }
                            mergeCommand += " " + "cat output ~/workspace/0xFEEDFACE/EALSurfer/public/clientpdfs/" + finalPDFNAME;
                            exec(mergeCommand, (err, stdout, stderr) => {
                                if(err !== null) {
                                    reject(err);
                                    return;
                                }
                            });
                        }
                        else{} //change name
                          
                        }));
                    });
                }));
            }
            else{
                console.log(stdout);
                console.log(stderr);
                console.log(err);
                reject(err);
                return;
            }
        });
    });
};

/******************************************************************************
* @chemRefProcessor takes a EAL Surfer .xlsx file and pulls out
* the data necessary to display to the end user. **This is not for processsing
* the EAL Surfer form. That is done with Java. */

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
* Server startup EAL Surfer data extraction necessary data for client end.
*/

chemRefProcessor("public/uploads/master_spreadsheet_files/test.xlsx");

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running...");
});