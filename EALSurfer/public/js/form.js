var generate = document.getElementById("generate");


generate.addEventListener("click", function() {
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
    xmlHttp.open("GET", path, true); // true for asynchronous 
    xmlHttp.send(null);
});

