var ctx = document.getElementById('canvas').getContext('2d');

var radians = function(degrees) {
  return Math.PI * degrees / 180
};

var degrees = function(radians) {
  return radians * 180 / Math.PI
};


var xValueElement = document.getElementById('value-x');
var vValueElement = document.getElementById('value-speed');
var FresValueElement = document.getElementById('value-fres');
var FhValueElement = document.getElementById('value-fh');
var aValueElement = document.getElementById("value-a");
var tValueElement = document.getElementById('value-t');

var width = canvas.getAttribute('width'),
    height = canvas.getAttribute('height'),
    g = document.getElementById('g').value,
    mass = document.getElementById('mass').value,
    my = document.getElementById("my").value,
    vi = document.getElementById("vi").value,
    angle = radians(document.getElementById("angle").value),
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
    // teljetegemine??
    /*
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(0,100);
    this.ctx.closePath();
    this.ctx.stroke();
    */
    this.ctx.restore();
  }
};

var keha = new Keha(ctx, 80, 50);
var kolmnurk = new Kolmnurk(ctx);
keha.draw();

var showInfo = function(ctx, block) {
  xValueElement.innerHTML = Math.round(keha.x);
  vValueElement.innerHTML = Math.round(keha.Speed);
  aValueElement.innerHTML = Math.round(keha.a);
  FresValueElement.innerHTML = Math.round(keha.FRes);
  FhValueElement.innerHTML = Math.round(keha.Fh);
}

var step = function(timeStamp) {
  ctx.clearRect(0, 0, width, height);
  kolmnurk.draw();
  var t = timeStamp / 1000;
  keha.calcPos(t);
  keha.draw();
  tValueElement.innerHTML = parseFloat(t).toFixed(2);
  showInfo();
  if (keha.x <= kolmnurk.a/Math.sin(angle)-keha.w*2) {
      window.requestAnimationFrame(step);
  }
};

document.getElementById('magic').addEventListener('click', function(e) {
      window.requestAnimationFrame(step);
});
