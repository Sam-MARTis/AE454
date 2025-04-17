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
var button1 = document.getElementById("but1");
var button2 = document.getElementById("but2");
var button3 = document.getElementById("but3");
var button4 = document.getElementById("but4");
var button5 = document.getElementById("but5");
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
var TIME_STEP = 0.001;
var anim = 0;
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
    anim = requestAnimationFrame(startPlottingPhasePotriats);
};
var NUMBER_OF_POINTS = 2000;
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
    xdot = function (x, y) {
        return y;
    };
    ydot = function (x, y) {
        return 3 - x - Math.pow(y, 2);
    };
    // console.log("Button clicked");
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
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
    xdot = function (x, y) {
        return y;
    };
    ydot = function (x, y) {
        return -x + y * (1 - Math.pow(x, 2));
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
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
    xdot = function (x, y) {
        return 2 * x * y;
    };
    ydot = function (x, y) {
        return Math.pow(y, 2) - Math.pow(x, 2);
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
button4.addEventListener("click", function () {
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
    xdot = function (x, y) {
        return y + Math.pow(y, 2);
    };
    ydot = function (x, y) {
        return -x / 2 + y / 5 - x * y + (6 / 5) * (Math.pow(y, 2));
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
button5.addEventListener("click", function () {
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
    xdot = function (x, y) {
        return y + Math.pow(y, 2);
    };
    ydot = function (x, y) {
        return -x + (1 / 5) * y - x * y + (6 / 5) * (Math.pow(y, 2));
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
