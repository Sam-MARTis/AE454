var canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
var ctx = canvas.getContext("2d");
var button1 = document.getElementById("but1");
var button2 = document.getElementById("but2");
var button3 = document.getElementById("but3");
var TIME_STEP = 0.1;
var NUMBER_OF_POINTS = 1000;
var xMin = -2;
var xMax = 2;
var yMin = -2;
var yMax = 2;
var mapCanvasToSpace = function (xCanvas, yCanvas) {
    var xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    var ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
};
var mapSpaceToCanvas = function (xSpace, ySpace) {
    var xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    var yCanvas = ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
};
if (!ctx) {
    throw Error("Context unable to be found");
}
var xdot = function (x, y) {
    return y;
};
var ydot = function (x, y, mu) {
    if (mu === void 0) { mu = -0.90; }
    return mu * y + x - Math.pow(x, 3) + x * y;
};
var initializeSeedPoints = function (xmin, xmax, ymin, ymax, pointCount) {
    var seedPoints = [];
    for (var i = 0; i < pointCount; i++) {
        var x = Math.random() * (xmax - xmin) + xmin;
        var y = Math.random() * (ymax - ymin) + ymin;
        seedPoints.push([x, y]);
    }
    return seedPoints;
};
var points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
var anim = 0;
var startPlottingPhasePotriats = function (mu) {
    // prevPoints = points.slice(0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.005)"; // Try 0.02 to 0.1 depending on trail speed
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0];
        var y = points[i][1];
        // Use RK4
        var k1x = xdot(x, y);
        var k1y = ydot(x, y, mu);
        var k2x = xdot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y);
        var k2y = ydot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y, mu);
        var k3x = xdot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y);
        var k3y = ydot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y, mu);
        var k4x = xdot(x + TIME_STEP * k3x, y + TIME_STEP * k3y);
        var k4y = ydot(x + TIME_STEP * k3x, y + TIME_STEP * k3y, mu);
        var newX = x + TIME_STEP / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
        var newY = y + TIME_STEP / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
        points[i][0] = newX;
        points[i][1] = newY;
        ctx.beginPath();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "blue";
        ctx.moveTo.apply(ctx, mapSpaceToCanvas(x, y));
        ctx.lineTo.apply(ctx, mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();
    }
    anim = requestAnimationFrame(function () { startPlottingPhasePotriats(mu); });
};
var muVals = [-0.92, -0.8645, -0.80];
// drawDirectionField();
button1.addEventListener("click", function () {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.strokeStyle = "blue";
    // xdot = (x: number, y: number) => {
    //     return -2*Math.cos(x) - Math.cos(y);
    // }
    // ydot = (x: number, y: number) => {
    //     return -2*Math.cos(y) - Math.cos(x);
    // }
    // console.log("Button clicked");
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats(muVals[0]);
    // // ctx.strokeStyle = "black";
    // ctx.lineWidth = 1;
    // button1.style.display = "none";
});
button2.addEventListener("click", function () {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.strokeStyle = "blue";
    // xdot = (x: number, y: number) => {
    //     return y;
    // }
    // ydot = (x: number, y: number) => {
    //     return -x + y*(1 - x**2);
    // }
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats(muVals[1]);
});
button3.addEventListener("click", function () {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.strokeStyle = "blue";
    // xdot = (x: number, y: number) => {
    //     return 2*x*y;
    // }
    // ydot = (x: number, y: number) => {
    //     return y**2 - x**2;
    // }
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats(muVals[2]);
});
var initializeSomePoints = function (pointsToReset) {
    if (pointsToReset === void 0) { pointsToReset = 80; }
    var range = points.length;
    for (var i = 0; i < pointsToReset; i++) {
        var x = Math.random() * (xMax - xMin) + xMin;
        var y = Math.random() * (yMax - yMin) + yMin;
        points[Math.floor(Math.random() * range)] = [x, y];
    }
};
setInterval(function () {
    // points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    initializeSomePoints(100);
}, 500);
