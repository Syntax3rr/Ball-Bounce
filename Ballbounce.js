var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
//Declare variables
const ground = canvas.height;
const ceiling = 0;
const leftWall = 0;
const rightWall = canvas.width;
const pi = 3.1415926535897932384626;
var FPS = 120;
var x = 580;
var y = 50;
var vx = 0;
var vy = 0;
const g = (12 / FPS);
var ballRad = 15;
var ballThick = 1;
var ballMass = (4/3) * pi * (Math.pow(ballRad, 3) - Math.pow(ballRad - ballThick, 3)) * 2.7; //in grams
var airResist = ((((1.225 * 0.47 * ((4 * pi * Math.pow(ballRad, 2)) / 2)) / 2) * Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)) / ballMass) / FPS);
const ground1 = ground - ballRad;
const ceiling1 = 0 + ballRad;
const leftWall1 = 0 + ballRad;
const rightWall1 = rightWall - ballRad;
var stopped = 0;
var keyPress = [];
onkeydown = onkeyup = function(e) {
	e = e || event;
	keyPress[e.keyCode] = e.type == 'keydown';
}
//Bouncing off things
function bounce(nx, ny, circx, circy) {
	if (nx == 0 && ny == 0) {
		nx = circx - x;
		ny = circy - y;
	};
	var projScale = (-vx * nx + -vy * ny) / Math.pow(Math.hypot(nx, ny), 2);
	var ax = nx * projScale;
	var ay = ny * projScale;
	var bx = vx + ax;
	var by = vy + ay;
	var cx = ax + bx;
	var cy = ay + by;
	if (nx == 0) {
		vy = cy * 0.8;
	} else if (ny == 0) {
		vx = cx * 0.8;
	} else {
		vx = cx * 0.8;
		vy = cy * 0.8;
	};
};
//The actual game part
function gameLoop(){
	ctx.clearRect(0,0,canvas.width,canvas.height); //Clear Screen
	//Controls
	if (keyPress[87] || keyPress[38]) {
		stopped = 0;
		if (vy > -20) {
			vy += -(10 / FPS) - g;
		} else {
			vy = -20;
		};
	};
	if (keyPress[83] || keyPress[40]) {
		stopped = 0;
		if (vy < 20) {
			vy += (10 / FPS);
		} else {
			vy = 20;
		};
	};
	if (keyPress[65] || keyPress[37]) {
		if (vx > -20) {
			vx += -(10 / FPS);
		} else {
			vx = -20;
		};
	};
	if (keyPress[68] || keyPress[39]) {
		if (vx < 20) {
			vx += (10 / FPS);
		} else {
			vx = 20;
		};
	};

	airResist = -((((1.225 * 0.47 * ((4 * pi * Math.pow(ballRad, 2)) / 2)) / 2) * Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)) / ballMass) / FPS);//Detects if touching sides
	if (vx < 0) { //Factor in Sideways Air resistance
		vx += airResist;
	} else if (vx < 0) {
		vx -= airResist;
	};
	if (y < ground1) { //Gravity Accelleration & Air Resistance
		if(vy >= 0) {
			vy += g - airResist;
		} else {
			vy += g + airResist;
		};
	};
	if (y >= ground1 && stopped < FPS * 2) { //Collision
		y = ground1;
		bounce(0, -1);
	} else if (y >= ground1 && stopped > FPS * 2) {
		y = ground1;
	};
	if (y <= (ceiling1)) {
		y = ceiling1;
		bounce(0, 1);
	};
	if (x >= rightWall1) {
		x = rightWall1;
		bounce(-1, 0);
	};
	if (x <= leftWall1) {
		x = leftWall1;
		bounce(1, 0);
	};
	if (Math.hypot(Math.abs(550 - x), Math.abs(400 - y)) <= 50 + ballRad) {
		let scaleFactor = (50 + ballRad) / Math.hypot(Math.abs(550 - x), Math.abs(400 - y)) - 1;
		x += (x - 550) * scaleFactor;
		y += (y - 400) * scaleFactor;
		bounce(0, 0, 550, 400);
	};
	if (Math.hypot(Math.abs(220 - x), Math.abs(300 - y)) <= 30 + ballRad) {
		let scaleFactor = (30 + ballRad) / Math.hypot(Math.abs(220 - x), Math.abs(300 - y)) - 1;
		x += (x - 220) * scaleFactor;
		y += (y - 300) * scaleFactor;
		bounce(0, 0, 220, 300);
	};
	//Detects if touching walls
	if (y == ground1 || y == ceiling1) {
		touchSideH = true;
	} else {
		touchSideH = false;
	};
	if (x == leftWall1 || x == rightWall1) {
		touchSideV = true;
	} else {
		touchSideV = false;
	};
	if (y >= ground1 - 10 && y <= ground1 + 10 && stopped < 4) {
		stopped += 1/FPS;
		console.log(stopped);
	};
	ctx.beginPath(); //draw ball
	ctx.strokeStyle = "#fff";
	ctx.arc(x,y,ballRad,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath(); //draw second cicle
	ctx.strokeStyle = "#fab";
	ctx.arc(550,400,50,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath(); //draw third cicle
	ctx.strokeStyle = "#fab";
	ctx.arc(220,300,30,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	
	y += vy;
	x += vx;

	ctx.beginPath(); //draw line
	ctx.strokeStyle = '#fab';
	ctx.moveto
};
setInterval(gameLoop,1000/FPS);
