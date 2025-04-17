var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
var ctx = canvas.getContext("2d");
var buttonElement = document.getElementById("startButton");
var xMin = -5;
var xMax = 5;
var yMin = -5;
var yMax = 5;
var mapCanvasToSpace = function (xCanvas, yCanvas) {
    var xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    var ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
};
var mapSpaceToCanvas = function (xSpace, ySpace) {
    var xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    var yCanvas = canvas.height - ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
};
if (!ctx) {
    throw Error("Context unable to be found");
}
var xdot = function (x, y) {
    return x + Math.exp(-y);
};
var ydot = function (x, y) {
    return -y;
};
var drawDirectionField = function () {
    ctx.strokeStyle = "red";
    console.log("Drawing direction field");
    for (var i = xMin; i < xMax; i += 0.2) {
        for (var j = yMin; j < yMax; j += 0.2) {
            var x = i;
            var y = j;
            var xdotValue = xdot(x, y);
            var ydotValue = ydot(x, y);
            var length_1 = Math.pow((Math.sqrt(Math.pow(xdotValue, 2) + Math.pow(ydotValue, 2))), 0.5);
            var drawLength = 0.1;
            ctx.strokeStyle = "rgb(".concat(length_1 * 50, ", 0, ").concat(255 - length_1 * 50, ")");
            // if(length > 1){
            //     length = 0;
            // }
            if (length_1 < 0.1) {
                length_1 = 0.1;
            }
            var angle = Math.atan2(ydotValue, xdotValue);
            ctx.beginPath();
            ctx.moveTo.apply(ctx, mapSpaceToCanvas(x, y));
            ctx.lineTo.apply(ctx, mapSpaceToCanvas(x + drawLength * Math.cos(angle), y + drawLength * Math.sin(angle)));
            ctx.stroke();
            ctx.arc.apply(ctx, __spreadArray(__spreadArray([], mapSpaceToCanvas(x + drawLength * Math.cos(angle), y + drawLength * Math.sin(angle)), false), [2, 0, Math.PI * 2], false));
            // ctx.fillStyle = "red";
            ctx.fill();
            // ctx.arcTo(...mapSpaceToCanvas(x + xdotValue/length*0.1, y + ydotValue/length*0.1), 2, 0, Math.PI*2);
            // ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
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
var points = initializeSeedPoints(xMin, xMax, yMin, yMax, 2000);
var TIME_STEP = 0.003;
var startPlottingPhasePotriats = function () {
    ctx;
    // prevPoints = points.slice(0);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0];
        var y = points[i][1];
        // Use RK4
        var k1x = xdot(x, y);
        var k1y = ydot(x, y);
        var k2x = xdot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y);
        var k2y = ydot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y);
        var k3x = xdot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y);
        var k3y = ydot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y);
        var k4x = xdot(x + TIME_STEP * k3x, y + TIME_STEP * k3y);
        var k4y = ydot(x + TIME_STEP * k3x, y + TIME_STEP * k3y);
        var newX = x + TIME_STEP / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
        var newY = y + TIME_STEP / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
        points[i][0] = newX;
        points[i][1] = newY;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.moveTo.apply(ctx, mapSpaceToCanvas(x, y));
        ctx.lineTo.apply(ctx, mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();
    }
    requestAnimationFrame(startPlottingPhasePotriats);
};
drawDirectionField();
buttonElement.addEventListener("click", function () {
    console.log("Button clicked");
    startPlottingPhasePotriats();
    // ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    buttonElement.style.display = "none";
});
