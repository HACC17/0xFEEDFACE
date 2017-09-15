$( document ).ready(function() {
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
    
    /*
    * Validate form and send form request to server
    */
    
    $("#submit").on("click", function(event){
        event.preventDefault();
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
           else {
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
               "sheet2" : {
                   "D5" : landuse,
                   "D7" : groundwaterutility,
                   "D10" : distancetowater,
                   "D14": chemicalInputTypes[i].value,
                   "C16": userChemicals[i].value,
                   "D22": soilsamples[i].value,
                   "D24": groundwatersamples[i].value,
                   "D26": soilvaporsamples[i].value
                            },
               "sheet4" : {
                   "D4" : siteinfo[0].value,
                   "D5" : siteinfo[1].value,
                   "D6" : siteinfo[2].value,
                   "E6" : siteinfo[3].value,
                   "F7" : siteinfo[4].value,
                   "D9" : siteinfo[5].value
               }
           };//make form object
           reportOrder.push(formRequest);
       }
       $('select').material_select();
       $('.tooltipped').tooltip({delay: 50});
       Materialize.updateTextFields();
       if(formready){
           document.getElementById("invalidform").innerHTML = "";
           var xhttp = new XMLHttpRequest();
           xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        
                    };
                    console.log(this.status);
                };

            xhttp.open("GET", "/submit/"+ JSON.stringify(reportOrder), true);
            xhttp.send();
        }
        else{
            document.getElementById("invalidform").innerHTML = "<p style='color: red'>Oops! Please correct all fields marked in red.</p>";
        }
    });
	    
	var canvas = document.getElementById("banner");
	var ctx = canvas.getContext("2d");
	ctx.scale(.9,.9);
	canvas.width = window.innerWidth;
	canvas.height = window.innerWidth/2.2;
	ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, .4*canvas.height);
      ctx.bezierCurveTo(.4*canvas.width, -(.4*canvas.height), .6*canvas.width, .7*canvas.height, .89*canvas.width, .2*canvas.height);
      ctx.bezierCurveTo(.6*canvas.width, .8*canvas.height, .4*canvas.width, 0, 0, .4*canvas.height);
      var grd=ctx.createLinearGradient(0,0,400,0);
        grd.addColorStop(.4,"#85d8ce");
        grd.addColorStop(1,"#085078");
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(.7*canvas.width, .3*canvas.height);
      ctx.bezierCurveTo(.94*canvas.width, .35*canvas.height, .9*canvas.width, -.1*canvas.height, .7*canvas.width, .1*canvas.height);
      ctx.bezierCurveTo(.8*canvas.width, .08*canvas.height, .8*canvas.width, .25*canvas.height, .7*canvas.width, .3*canvas.height);
      ctx.fillStyle = '#85d8ce';
      ctx.fill();
});
