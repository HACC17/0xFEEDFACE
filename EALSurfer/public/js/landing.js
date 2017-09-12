  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth/2;
  var waves = ["rgba(245, 245, 255, 0.3)",
               "rgba(171, 180, 201, 0.3)",
               "rgba(135, 199, 215, 0.3)"]
  var i = 0;
function draw() {
    canvas.width = canvas.width;
    for(var j = waves.length - 1; j >= 0; j--) {
      var offset = i + j * Math.PI * 12;
      ctx.fillStyle = (waves[j]);
      var left            = (Math.sin(offset/100)  + 1)       / 2 * 200;
      var right           = (Math.sin((offset/100) + 10) + 1) / 2 * 200;
      var leftConstraint  = (Math.sin((offset/60)  + 2)  + 1) / 2 * 200;
      var rightConstraint = (Math.sin((offset/60)  + 1)  + 1) / 2 * 200;
      ctx.beginPath();
      ctx.moveTo(0, left + 400);
      // ctx.lineTo(canvas.width, right + 100);
      ctx.bezierCurveTo(canvas.width / 3, leftConstraint+400, canvas.width / 3 * 2, rightConstraint+400, canvas.width, right + 400);
      ctx.lineTo(canvas.width , canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(0, left + 400);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.moveTo(.1*canvas.width, .6*canvas.height);
      ctx.bezierCurveTo(.4*canvas.width, -(.4*canvas.height), .6*canvas.width, canvas.height, .89*canvas.width, .37*canvas.height);
      ctx.bezierCurveTo(.6*canvas.width, 1.2*canvas.height, .4*canvas.width, .2*canvas.height, .1*canvas.width, .6*canvas.height);
      var grd=ctx.createLinearGradient(0,0,400,0);
        grd.addColorStop(.1,"#85d8ce");
        grd.addColorStop(.5,"#085078");
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(.7*canvas.width, .5*canvas.height);
      ctx.bezierCurveTo(1*canvas.width, .5*canvas.height, .9*canvas.width, -.2*canvas.height, .7*canvas.width, .1*canvas.height);
      ctx.bezierCurveTo(.8*canvas.width, .08*canvas.height, .8*canvas.width, .4*canvas.height, .7*canvas.width, .5*canvas.height);
      ctx.fillStyle = '#85d8ce';
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#085078';
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.font = "Bold Italic " + .6*canvas.height + 'px Ariel';
      ctx.strokeText('EAL', .1*canvas.width, .6*canvas.height, .3*canvas.width);
      ctx.fillText('EAL', .1*canvas.width, .6*canvas.height, .3*canvas.width);
      ctx.fillStyle = '#85d8ce';
      ctx.font = "Italic " + .6*canvas.height + 'px Ariel';
      ctx.fillText('Surfer', .42*canvas.width, .6*canvas.height, .4*canvas.width);
      ctx.strokeText('Surfer', .42*canvas.width, .6*canvas.height, .4*canvas.width);
      document.getElementById("bannertitle").innerHTML = "<a href='/instructions'><h1>EAL <span style='font-family: Satisfy'>Surfer<sup>+</sup></span></h1></a>"
    }
    i = i + 3;
  }
  setInterval("draw()", 20);