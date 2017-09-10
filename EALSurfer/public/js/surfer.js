$( document ).ready(function() {

function drawLogo(ctx, xoff, yoff) {
  ctx.beginPath();
  ctx.moveTo(0, yoff);
  ctx.bezierCurveTo(.2*xoff, -(.3*yoff), .3*xoff, 1.4*yoff, .375*xoff, .4*yoff);
  ctx.bezierCurveTo(.3*xoff, 1.8*yoff, .2*xoff, .5*yoff, 0, yoff);
  ctx.fillStyle = '#8ED6FF';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(.1*xoff, .9*yoff);
  ctx.bezierCurveTo(.2*xoff, -(.3*yoff), .3*xoff, 1.4*yoff, .375*xoff, .5*yoff);
  ctx.bezierCurveTo(.3*xoff, 1.8*yoff, .2*xoff, .5*yoff, .1*xoff, .9*yoff);
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = .8;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(.28*xoff, .6*yoff);
  ctx.bezierCurveTo(.31*xoff, .65*yoff, .34*xoff, .25*yoff, .33*xoff, 0*yoff);
  ctx.bezierCurveTo(.41*xoff, .08*yoff, .36*xoff, .8*yoff, .28*xoff, .6*yoff);
  ctx.fillStyle = '#8ED6FF';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(.347*xoff, .1*yoff);
  ctx.lineTo(.352*xoff, .1*yoff);
  ctx.lineTo(.352*xoff, .2*yoff);
  ctx.lineTo(.362*xoff, .2*yoff);
  ctx.lineTo(.362*xoff, .25*yoff);
  ctx.lineTo(.352*xoff, .25*yoff);
  ctx.lineTo(.352*xoff, .35*yoff);
  ctx.lineTo(.347*xoff, .35*yoff);
  ctx.lineTo(.347*xoff, .25*yoff);
  ctx.lineTo(.337*xoff, .25*yoff);
  ctx.lineTo(.337*xoff, .2*yoff);
  ctx.lineTo(.347*xoff, .2*yoff);
  ctx.lineTo(.347*xoff, .1*yoff);
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#8ED6FF';
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = .8;
  ctx.fillStyle = '#6188c6';
  ctx.font = /*"Black Italic" + */1.2*yoff + 'px Roboto';
  ctx.fillText('EAL', 0, yoff, .7*yoff);
  ctx.font = "Italic " + 1.1*yoff + 'px Ariel';
  ctx.fillText('Surfer', .75*yoff, yoff, yoff);
}
    
var banner = $("#displaytitle")[0];
var ctx = banner.getContext("2d");
var offsetHeight = $("#banner")[0].offsetHeight;
var offsetWidth = $("#banner")[0].offsetWidth;
drawLogo(ctx, offsetWidth, offsetHeight);

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
                $(".chemicalchooser").append("<div class='row'><div class='input-field col s3'><select class='chemicalInputType'><option value='1'>Name</option><option value='2'>CAS #</option></select></div><div class='input-field col m6 s9'><select class='chemical'><option class='disabled'>Choose Chemical</option>"+data+"</select></div><div class='input-field col m3 s12'><a class='btn-floating btn waves-effect waves-light tooltipped deletebtn' data-position='top' data-delay='50' data-tooltip='Remove this entry'><i class='material-icons'>clear</i></a></div></div>");
                $(".sitedata").append("<div class ='row optionalsitedata'><div class='input-field col s4 soil'><label>Soil (mg/kg)</label><input type='number'></div><div class='input-field col s4 groundwater'><label>Groundwater (ug/L)</label><input type='number'></div><div class='input-field col s4 soilvapor'><label>Soil Vapor (ug/m3)</label><input type='number'></div></div>");
                $('select').material_select();
                $('.tooltipped').tooltip({delay: 50});
                setChemListener();
                $(".deletebtn").each(function(index){
                    var option = $('.optionalsitedata');
                    this.addEventListener("click", function(){
                        $(".deletebtn").tooltip('hide');
                        this.parentElement.parentElement.remove();
                        option[index+1].remove();
                    })
                });
            }
        };
        xhttp.open("GET", "/chemlist", true);
        xhttp.send();
    });
    
    $("#submit").click(function(event){
        var formready = true;
        var reportOrder = [];
        /*
        This section of data is the same for every object.
        */
        var landuse = document.getElementById("landuse").value;
        var groundwaterutility = document.getElementById("groundwaterutility").value;
        var distancetowater = document.getElementById("distancetowater").value;
        var siteinfo = [];
        siteinfo.push($("#sitename")[0]);
        siteinfo.push($("#siteaddress")[0]);
        siteinfo.push($("#sitecity")[0]);
        siteinfo.push($("#sitestate")[0]);
        siteinfo.push($("#sitezip")[0]);
        siteinfo.push($("#sitedate")[0]);
        /*
        
        */
       var userChemicals = $(".chemical>select");
       var soilsamples = $(".soil>input");
       var groundwatersamples = $(".groundwater>input");
       var soilvaporsamples = $(".soilvapor>input");
       var chemicalInputTypes = $(".chemicalInputType>select");
       
       /*Add Input Validation*/
       siteinfo.forEach(function(data){
           if(data.value == ""){
             data.classList.add("invalid");
             formready=false;
           }
           else { console.log(data);
           data.classList.remove("invalid");
           }
       })
       /*If validated continue*/
       
        
        /*
        Build the reqest forms.
        */
       for(var i = 0; i < userChemicals.length; i++){
           if(userChemicals[i].value=="Choose Chemical"){
               userChemicals[i].classList.add("invalid");
               formready = false;
           } 
           else userChemicals[i].classList.remove("invalid");
           var formRequest = {
               "sheet1" : {
                   "D5" : landuse,
                   "D7" : groundwaterutility,
                   "D10" : distancetowater,
                   "D14": chemicalInputTypes[i].value,
                   "C16": userChemicals[i].value,
                   "D22": soilsamples[i].value,
                   "D24": groundwatersamples[i].value,
                   "D26": soilvaporsamples[i].value
                            },
               "sheet2" : {
                   "D4" : siteinfo[0],
                   "D5" : siteinfo[1],
                   "D6" : siteinfo[2],
                   "E6" : siteinfo[3],
                   "F7" : siteinfo[4],
                   "D9" : siteinfo[5]
               }
           };//make form object
           reportOrder.push(formRequest);
       }
       $('select').material_select();
       $('.tooltipped').tooltip({delay: 50});
       Materialize.updateTextFields();
       if(formready){
           var xhttp = new XMLHttpRequest();
           xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        
                    };
                };
            xhttp.open("GET", "/submit/"+JSON.stringify(reportOrder), true);
            xhttp.send();
        }
        else{
            $(".finish").append("<div class='col s6 invalidfieldwarning'><p style='text-align:center; color:red'>Some fields are invalids. Please update all fields marked in red.</p> </div>");
        }
    });
});
/*

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
