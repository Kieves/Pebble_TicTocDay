var rocky = require('rocky');
//Global weather variable
var weather;
var settings = null;

rocky.postMessage({command: 'settings'});

function fractionToRadian(fraction){
  return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, color){
  var x2 = cx + Math.sin(angle)*length;
  var y2 = cy - Math.cos(angle)*length;
  //Configure hand draw settings
  ctx.lineWidth = 8;
  ctx.strokeStyle = color;
  
  //Drawing begins
  ctx.beginPath();
  //Move to center
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);
  //Draw
  ctx.stroke();
}

function drawDot(ctx, x){
  ctx.lineWidth = 8;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(x, 8);
  ctx.lineTo(x, 9);
  ctx.stroke();
}

function drawDateAndWeather(ctx, d, x, y){
  
  //Draw weather and day number
  var weatherOffset = 0;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '18px bold Gothic';
  if(weather){
    weatherOffset = 20;
    var weatherString = weather.celcius + '°';
    ctx.fillText(weatherString, x+weatherOffset, y-24);
  }
  ctx.font = '14px bold Gothic';
  ctx.fillText(d.getDate(), x-weatherOffset, y-19);
  
  //Draw Calendar
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.moveTo(x-9-weatherOffset, y-18);
  ctx.lineTo(x+9-weatherOffset, y-18);
  ctx.stroke();
  ctx.moveTo(x-9-weatherOffset, y-22);
  ctx.lineTo(x+9-weatherOffset, y-22);
  ctx.stroke();
  ctx.moveTo(x-9-weatherOffset, y-22);
  ctx.lineTo(x-9-weatherOffset, y-2);
  ctx.stroke();
  ctx.moveTo(x+9-weatherOffset, y-22);
  ctx.lineTo(x+9-weatherOffset, y-2);
  ctx.stroke();
  ctx.moveTo(x-9-weatherOffset, y-2);
  ctx.lineTo(x+9-weatherOffset, y-2);
  ctx.stroke();
}

rocky.on('minutechange', function(event){
  rocky.requestDraw();
  if (settings && !weather) {
    //console.log("sending key: " + settings.apikey);
    rocky.postMessage({'fetch':true, 'apikey':settings.apikey});
  }
});

rocky.on('hourchange', function(event){
  if (settings) {
    //console.log("sending key: " + settings.apikey);
    rocky.postMessage({'fetch':true, 'apikey':settings.apikey});
  }
});

rocky.on('message', function(event){
  var message = event.data;
  if(message.weather){
    weather = message.weather;
    
    rocky.requestDraw();
  }
  settings = event.data;
});

rocky.on('draw', function(event){
  //Get the CanvasRenderingContext2D object
  var ctx = event.context;
  var d = new Date();

  //Clear screen
  ctx.clearRect(0,0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  //Determine width, height, center and max size of hands
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  var cx = w/2;
  var cy = h/2;
  
  var maxLength = (Math.min(w,h) - 34) / 2;
  
  //d.getMinutes()
  var minuteFraction = (0 / 60);
  var minuteAngle = fractionToRadian(minuteFraction);
  var hourFraction = (14 % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);
  
  drawHand(ctx, cx, cy, minuteAngle, maxLength, "white");
  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "red");
  drawDot(ctx, cx);
  drawDateAndWeather(ctx, d, cx, h);
  //console.log("Current day: " + d.getDate() + ", current month: " + d.getMonth());
});


