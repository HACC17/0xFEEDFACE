$( document ).ready(function() {
    /*
    Code to grab Final EAL values when client chooses a chemical. Saved as a
    variable so it can be called when user adds another chemical line to form
    */
    var setChemListener = function(){
        $(".chemical").change(function(event){
            if(this.selectedIndex > 0){
                var chemindex = this.selectedIndex;
                var drinking = $("#groundwaterutility")[0].selectedIndex;
                var distance = $("#distancetowater")[0].selectedIndex;
                var use = $("#landuse")[0].selectedIndex;
                var xhttp = new XMLHttpRequest();
                var data;
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        data = JSON.parse(this.responseText);
                        $("#chemicalinfotitle").html(event.target.value);
                        $("#refeals").html(data);
                    };
                };
                xhttp.open("GET", "/chemdata/"+(chemindex-1)+"/"+drinking+"/"+distance+"/"+use, true);
                xhttp.send();
            };
        });
    }
    
    /*
    Initialize Materialize inputs
    */
   $('select').material_select();
    /*
    Initialize collapsable sidenav
    */
   $('.button-collapse').sideNav({
      menuWidth: 300, 
      edge: 'left', 
      closeOnClick: true, 
      draggable: true,    
   });
   
    setChemListener();
    /*
    Add chemical button, adds another chemical input line to the EAL Form
    */
    $("#addchemical").on("click", function(e){
        var xhttp = new XMLHttpRequest();
        var data;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                $(".chemicalchooser").append("<div class='row'><div class='input-field col s3'><select><option value='1'>Name</option><option value='2'>CAS #</option></select></div><div class='input-field col m6 s9'><select class='chemical'><option class='disabled'>Choose Chemical</option>"+data+"</select></div></div>");
                $('select').material_select();
                setChemListener();
            }
        };
        xhttp.open("GET", "/chemlist", true);
        xhttp.send();
    });
   
});


  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
/*
var generate = document.getElementById("generate");
var chemical = document.getElementById("chemical");
var chemicalInputType = document.getElementById("chemicalInputType");
var chemicalInputChoice= document.getElementsByName("chemicalInputType");
var instructionstab = document.getElementById("instructionstab");
var ealformtab = document.getElementById("ealformtab");
var ealform = document.getElementById("submitted").innerHTML;
var instructions = "<div class='container ealsurfer'>Instructions from the first tab of the Excel sheet will go here</div>";

document.getElementById("chemicalinfotitle").innerHTML = chemical.value;

//listen for incoming JSON string
//turn back into JSON object
//use for Final EAL Chemical references
/*
instructionstab.addEventListener("click", function(e){
    if(!instructionstab.classList.contains("tab-selected")){
        document.getElementsByClassName("tab-selected")[0].classList.toggle("tab-selected");
        instructionstab.classList.toggle("tab-selected");
        document.getElementById("submitted").innerHTML = instructions;
    }
});

ealformtab.addEventListener("click", function(e){
    if(!ealformtab.classList.contains("tab-selected")){
        document.getElementsByClassName("tab-selected")[0].classList.toggle("tab-selected");
        ealformtab.classList.toggle("tab-selected");
        document.getElementById("submitted").innerHTML = ealform;
        generate = document.getElementById("generate");
        chemical = document.getElementById("chemical");
        chemicalInputType = document.getElementById("chemicalInputType");
        chemicalInputChoice= document.getElementsByName("chemicalInputType");
        document.getElementById("chemicalinfotitle").innerHTML = chemical.value;
        chemical.addEventListener("change", function(e){
            chemical =  document.getElementById("chemical");
            document.getElementById("chemicalinfotitle").innerHTML = chemical.value;
        });
    }
})

generate.addEventListener("click", function(event) {
    var formdata = {
        "sheet1": {
            "D5":document.getElementById("landUse").value,
            "D7":document.getElementById("groundWaterUtility").value,
            "D10":document.getElementById("distanceToWater").value,
            "D14":document.getElementById("chemicalInputType").value,
            "C16":document.getElementById("chemical").value,
            "D22":document.getElementById("soil").value,
            "D24":document.getElementById("groundWater").value,
            "D26":document.getElementById("soilVapor").value
        }
    }
    var rawdata = JSON.stringify(formdata);
    var path = "/report/" + rawdata;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("submitted").classList.toggle("display");
            document.getElementById("submitted").innerHTML = xmlHttp.response;
            console.log(xmlHttp.response);
       }
    };
    xmlHttp.open("GET", path, true); // true for asynchronous 
    xmlHttp.send();
    
});

*/
