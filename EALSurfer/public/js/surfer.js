$( document ).ready(function() {
 
   $('select').material_select();

   $('.button-collapse').sideNav({
      menuWidth: 300, 
      edge: 'left', 
      closeOnClick: true, 
      draggable: true,    
   });

   $("#instructionstab").click(function(event){
        event.preventDefault();
   });

   $("ealsurfertab").click(function(event){
        event.preventDefault();
   })

   $("#chemical").change(function(event){
        var chemindex = $("#chemical")[0].selectedIndex;
        var drinking = $("#groundwaterutility")[0].selectedIndex;
        var distance = $("#distancetowater")[0].selectedIndex;
        var xhttp = new XMLHttpRequest();
        var data;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                console.log(data);
                $("#chemicalinfotitle").html(event.target.value);
                $("#refeals").html(data);
            }
        };
        xhttp.open("GET", "/chemdata/"+chemindex+"/"+drinking+"/"+distance, true);
        xhttp.send();
   })
 
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

chemicalInputType.addEventListener("change", function(e){
    if(chemicalInputChoice[0].checked){
        chemical.innerHTML = "<option>ACENAPHTHENE</option><option>ACENAPHTHYLENE</option><option>ACETONE</option><option>ALDRIN</option><option>AMETRYN</option><option>AMINO,2- DINITROTOLUENE,4,6-</option><option>AMINO,4- DINITROTOLUENE,2,6-</option><option>ANTHRACENE</option><option>ANTIMONY</option><option>ARSENIC</option><option>ATRAZINE</option><option>BARIUM</option><option>BENOMYL</option><option>BENZENE</option><option>BENZO(a)ANTHRACENE</option><option>BENZO(a)PYRENE</option><option>BENZO(b)FLUORANTHENE</option><option>BENZO(g,h,i)PERYLENE</option><option>BENZO(k)FLUORANTHENE</option><option>BERYLLIUM</option><option>BIPHENYL, 1,1-</option><option>BIS(2-CHLOROETHYL)ETHER</option><option>BIS(2-CHLORO-1-METHYLETHYL)ETHER</option><option>BIS(2-ETHYLHEXYL)PHTHALATE</option><option>BORON</option><option>BROMODICHLOROMETHANE</option><option>BROMOFORM</option><option>BROMOMETHANE</option><option>CADMIUM</option><option>CARBON TETRACHLORIDE</option><option>CHLORDANE (TECHNICAL)</option><option>CHLOROANILINE, p-</option><option>CHLOROBENZENE</option><option>CHLOROETHANE</option><option>CHLOROFORM</option><option>CHLOROMETHANE</option><option>CHLOROPHENOL, 2-</option><option>CHROMIUM (Total)</option><option>CHROMIUM III</option><option>CHROMIUM VI</option><option>CHRYSENE</option><option>COBALT</option><option>COPPER</option><option>CYANIDE (Free)</option><option>CYCLO-1,3,5-TRIMETHYLENE-2,4,6-TRINITRAMINE (RDX)</option><option>DALAPON</option><option>DIBENZO(a,h)ANTHTRACENE</option><option>DIBROMO-3-CHLOROPROPANE, 1,2-</option><option>DIBROMOCHLOROMETHANE</option><option>DIBROMOETHANE, 1,2-</option><option>DICHLOROBENZENE, 1,2-</option><option>DICHLOROBENZENE, 1,3-</option><option>DICHLOROBENZENE, 1,4-</option><option>DICHLOROBENZIDINE, 3,3-</option><option>DICHLORODIPHENYLDICHLOROETHANE (DDD)</option><option>DICHLORODIPHENYLDICHLOROETHYLENE (DDE)</option><option>DICHLORODIPHENYLTRICHLOROETHANE (DDT)</option><option>DICHLOROETHANE, 1,1-</option><option>DICHLOROETHANE, 1,2-</option><option>DICHLOROETHYLENE, 1,1-</option><option>DICHLOROETHYLENE, Cis 1,2-</option><option>DICHLOROETHYLENE, Trans 1,2-</option><option>DICHLOROPHENOL, 2,4-</option><option>DICHLOROPHENOXYACETIC ACID (2,4-D)</option><option>DICHLOROPROPANE, 1,2-</option><option>DICHLOROPROPENE, 1,3-</option><option>DIELDRIN</option><option>DIETHYLPHTHALATE</option><option>DIMETHYLPHENOL, 2,4-</option><option>DIMETHYLPHTHALATE</option><option>DINITROBENZENE, 1,3-</option><option>DINITROPHENOL, 2,4-</option><option>DINITROTOLUENE, 2,4- (2,4-DNT)</option><option>DINITROTOLUENE, 2,6- (2,6-DNT)</option><option>DIOXANE, 1,4-</option><option>DIOXINS (TEQ)</option><option>DIURON</option><option>ENDOSULFAN</option><option>ENDRIN</option><option>ETHANOL</option><option>ETHYLBENZENE</option><option>FLUORANTHENE</option><option>FLUORENE</option><option>GLYPHOSATE</option><option>HEPTACHLOR</option><option>HEPTACHLOR EPOXIDE</option><option>HEXACHLOROBENZENE</option><option>HEXACHLOROBUTADIENE</option><option>HEXACHLOROCYCLOHEXANE (gamma) LINDANE</option><option>HEXACHLOROETHANE</option><option>HEXAZINONE</option><option>INDENO(1,2,3-cd)PYRENE</option><option>ISOPHORONE</option><option>LEAD</option><option>MERCURY</option><option>METHOXYCHLOR</option><option>METHYL ETHYL KETONE</option><option>METHYL ISOBUTYL KETONE</option><option>METHYL MERCURY</option><option>METHYL TERT BUTYL ETHER</option><option>METHYLENE CHLORIDE</option><option>METHYLNAPHTHALENE, 1-</option><option>METHYLNAPHTHALENE, 2-</option><option>MOLYBDENUM</option><option>NAPHTHALENE</option><option>NICKEL</option><option>NITROBENZENE</option><option>NITROGLYCERIN</option><option>NITROTOLUENE, 2-</option><option>NITROTOLUENE, 3-</option><option>NITROTOLUENE, 4-</option><option>PENTACHLOROPHENOL</option><option>PENTAERYTHRITOLTETRANITRATE (PETN)</option><option>PERCHLORATE</option><option>PHENANTHRENE</option><option>PHENOL</option><option>POLYCHLORINATED BIPHENYLS (PCBs)</option><option>PROPICONAZOLE</option><option>PYRENE</option><option>SELENIUM</option><option>SILVER</option><option>SIMAZINE</option><option>STYRENE</option><option>TERBACIL</option><option>tert-BUTYL ALCOHOL</option><option>TETRACHLOROETHANE, 1,1,1,2-</option><option>TETRACHLOROETHANE, 1,1,2,2-</option><option>TETRACHLOROETHYLENE</option><option>TETRACHLOROPHENOL, 2,3,4,6-</option><option>TETRANITRO-1,3,5,7-TETRAAZOCYCLOOCTANE (HMX)</option><option>THALLIUM</option><option>TOLUENE</option><option>TOXAPHENE</option><option>TPH (gasolines)</option><option>TPH (middle distillates)</option><option>TPH (residual fuels)</option><option>TRICHLOROBENZENE, 1,2,4-</option><option>TRICHLOROETHANE, 1,1,1-</option><option>TRICHLOROETHANE, 1,1,2-</option><option>TRICHLOROETHYLENE</option><option>TRICHLOROPHENOL, 2,4,5-</option><option>TRICHLOROPHENOL, 2,4,6-</option><option>TRICHLOROPHENOXYACETIC ACID, 2,4,5- (2,4,5-T)</option><option>TRICHLOROPHENOXYPROPIONIC ACID, 2,4,5- (2,4,5-TP)</option><option>TRICHLOROPROPANE, 1,2,3-</option><option>TRICHLOROPROPENE, 1,2,3-</option><option>TRIFLURALIN</option><option>TRINITROBENZENE, 1,3,5-</option><option>TRINITROPHENYLMETHYLNITRAMINE, 2,4,6- (TETRYL)</option><option>TRINITROTOLUENE, 2,4,6- (TNT)</option><option>VANADIUM</option><option>VINYL CHLORIDE</option><option>XYLENES</option>"
    }
    else{
        chemical.innerHTML = "Not Implemented";
    }
});

chemical.addEventListener("change", function(e){
   chemical =  document.getElementById("chemical").value;
   document.getElementById("chemicalinfotitle").innerHTML = chemical;
});


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
