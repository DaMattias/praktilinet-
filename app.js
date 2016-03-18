var ctx = document.getElementById('canvas').getContext('2d');

var radians = function(degrees) {
  return Math.PI * degrees / 180
};

var degrees = function(radians) {
  return radians * 180 / Math.PI
};


var xValueElement = document.getElementById('value-x'),
    vValueElement = document.getElementById('value-speed'),
    FresValueElement = document.getElementById('value-fres'),
    FhValueElement = document.getElementById('value-fh'),
    aValueElement = document.getElementById("value-a"),
    tValueElement = document.getElementById('value-t'),
    btnElement = document.getElementById("magic"),
    frameId = null,
    isRunning = false;

var width = canvas.getAttribute('width'),
    height = canvas.getAttribute('height'),
    g = document.getElementById('g').value,
    mass = document.getElementById('mass').value,
    my = document.getElementById("my").value,
    vi = document.getElementById("vi").value,
    angle = radians(document.getElementById("angle").value),
    startTime = null,
    pixelsByMeter=20;

ctx.translate(0, height);
ctx.scale(1, -1);

var Kolmnurk = function(ctx, fillStyle) {

  this.ctx = ctx;
  this.angle = angle;

  this.calcNurk = function() {
    if (angle<Math.atan((height-keha.h)/width)) {
      this.b = width;
      this.a = this.b*Math.tan(angle);
    } else {
      this.a = height-keha.h;
      this.b = this.a / Math.tan(angle);
    }
  };

  this.fillStyle = typeof fillStyle !== "undefined" ? fillStyle : "rgb(200,200,200)";

  this.draw = function() {
    this.calcNurk();
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(this.b, 0);
    this.ctx.lineTo(0,0);
    this.ctx.lineTo(0, this.a);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
};

var Keha = function(ctx, w, h, fillStyle) {
  this.ctx = ctx;

  /** Keha kõrgus */
  this.h = h;
  /** Keha laius */
  this.w = w;
  /** Keha positsioon x-teljel */
  this.x = null;
  /** Jõud, mis mõjub kehale x-telje suunas */
  this.Fx = null;
  /** Toereaktsioon */
  this.Fn = null;
  /** Hõõrdejõud */
  this.Fh = null;
  /** Resultantjõud */
  this.Fres = null;
  /** Keha kiirus */
  this.Speed = null;


  this.setX = function(x) {
    this.x = x;
  };

  this.calcFx = function() {
    this.Fx = mass*g*Math.sin(angle);
  };

  this.calcFn = function() {
    this.Fn = mass*g*Math.cos(angle);
  };

  this.calcCritAngle = function() {
    this.critAngle = Math.atan(my);
  };

  this.calcFh = function() {
    this.calcFn();
    this.calcCritAngle();
    if (vi == 0) {
      this.Fh = Math.min(my*this.Fn, this.Fx)
    } else if (vi != 0) {
      this.Fh = Math.sign(vi) * my * this.Fn
    }
  };

  this.calcFRes = function() {
    this.calcFx();
    this.calcFh();
    this.FRes = this.Fx-this.Fh;
  };

  this.calcA = function() {
    this.calcFRes();
    this.A = this.FRes / mass;
  };

  this.calcNurk = function() {
    if (angle<Math.atan((height-keha.h)/width)) {
      this.b = width;
      this.a = this.b*Math.tan(angle);
    } else {
      this.a = height-keha.h;
      this.b = this.a / Math.tan(angle);
    }
  };

  this.calcSpeed = function(t) {
    this.calcA();
    this.Speed = vi + this.A*t
  };

  this.calcPos = function(t) {
    this.calcA()
    this.calcSpeed(t);
    this.x = pixelsByMeter * this.Speed * t;
  };


  this.fillStyle = typeof fillStyle !== "undefined" ? fillStyle : "rgb(100,100,100)";

  this.draw = function() {
    this.calcNurk();
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.translate(0,this.a);
    this.ctx.rotate(-angle);
    this.ctx.translate(this.w*0.6+this.x+this.w/2,this.h/2);
    this.ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    this.ctx.restore();
  }
};

var keha = new Keha(ctx, 80, 50);
var kolmnurk = new Kolmnurk(ctx);

var showInfo = function(ctx, block) {
  xValueElement.innerHTML = Math.round(keha.x)/pixelsByMeter;
  vValueElement.innerHTML = Math.round(keha.Speed);
  aValueElement.innerHTML = Math.round(keha.a)/pixelsByMeter;
  FresValueElement.innerHTML = Math.round(keha.FRes);
  FhValueElement.innerHTML = Math.round(keha.Fh);
};

var update = function() {
  width = canvas.getAttribute('width'),
  height = canvas.getAttribute('height'),
  g = Number(document.getElementById('g').value),
  mass = Number(document.getElementById('mass').value),
  my = Number(document.getElementById("my").value),
  vi = Number(document.getElementById("vi").value),
  angle = radians(Number(document.getElementById("angle").value))
}


var step = function(timeStamp) {
  if (!startTime) {
    startTime = timeStamp / 1000;
  }
  ctx.clearRect(0, 0, width, height);
  kolmnurk.draw();
  var t = timeStamp / 1000 -  startTime;
  keha.calcPos(t);
  keha.draw();
  tValueElement.innerHTML = parseFloat(t).toFixed(2);
  showInfo();
  console.log(keha.Fh, keha.Fx)
  if (keha.x <= kolmnurk.a/Math.sin(angle)-keha.w*2 && isRunning) {
      frameId = window.requestAnimationFrame(step);
  } else {
    startTime = null;
    btnElement.innerHTML = 'START';
    isRunning = false;
  }
};


document.getElementById('magic').addEventListener('click', function(e) {
  if (isRunning) {
    isRunning = false;
    btnElement.innerHTML = 'START';
  } else {
    update();
    isRunning = true;
    btnElement.innerHTML = 'STOP';
    window.requestAnimationFrame(step);
  }
});
