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
                $(".chemicalchooser").append("<div class='row'><div class='input-field col s3'><select><option value='1'>Name</option><option value='2'>CAS #</option></select></div><div class='input-field col m6 s9'><select class='chemical'><option class='disabled'>Choose Chemical</option>"+data+"</select></div><div class='input-field col m3 s12'><a class='btn-floating btn waves-effect waves-light tooltipped deletebtn' data-position='top' data-delay='50' data-tooltip='Remove this entry'><i class='material-icons'>clear</i></a></div></div>");
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
