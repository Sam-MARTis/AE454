"use strict";
const canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const ctx = canvas.getContext("2d");
const button1 = document.getElementById("but1");
const button2 = document.getElementById("but2");
const button3 = document.getElementById("but3");
const button4 = document.getElementById("but4");
const button5 = document.getElementById("but5");
const xMin = -5;
const xMax = 5;
const yMin = -5;
const yMax = 5;
const mapCanvasToSpace = (xCanvas, yCanvas) => {
    const xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    const ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
};
const mapSpaceToCanvas = (xSpace, ySpace) => {
    const xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    const yCanvas = ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
};
if (!ctx) {
    throw Error("Context unable to be found");
}
let xdot = (x, y) => {
    return x + Math.exp(-y);
};
let ydot = (x, y) => {
    return -y;
};
const drawDirectionField = () => {
    ctx.strokeStyle = "red";
    console.log("Drawing direction field");
    for (let i = xMin; i < xMax; i += 0.2) {
        for (let j = yMin; j < yMax; j += 0.2) {
            const x = i;
            const y = j;
            const xdotValue = xdot(x, y);
            const ydotValue = ydot(x, y);
            let length = (Math.sqrt(xdotValue ** 2 + ydotValue ** 2)) ** 0.5;
            const drawLength = 0.1;
            ctx.strokeStyle = `rgb(${length * 50}, 0, ${255 - length * 50})`;
            // if(length > 1){
            //     length = 0;
            // }
            if (length < 0.1) {
                length = 0.1;
            }
            const angle = Math.atan2(ydotValue, xdotValue);
            ctx.beginPath();
            ctx.moveTo(...mapSpaceToCanvas(x, y));
            ctx.lineTo(...mapSpaceToCanvas(x + drawLength * Math.cos(angle), y + drawLength * Math.sin(angle)));
            ctx.stroke();
            ctx.arc(...mapSpaceToCanvas(x + drawLength * Math.cos(angle), y + drawLength * Math.sin(angle)), 2, 0, Math.PI * 2);
            // ctx.fillStyle = "red";
            ctx.fill();
            // ctx.arcTo(...mapSpaceToCanvas(x + xdotValue/length*0.1, y + ydotValue/length*0.1), 2, 0, Math.PI*2);
            // ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
};
const initializeSeedPoints = (xmin, xmax, ymin, ymax, pointCount) => {
    const seedPoints = [];
    for (let i = 0; i < pointCount; i++) {
        const x = Math.random() * (xmax - xmin) + xmin;
        const y = Math.random() * (ymax - ymin) + ymin;
        seedPoints.push([x, y]);
    }
    return seedPoints;
};
let points = initializeSeedPoints(xMin, xMax, yMin, yMax, 2000);
const TIME_STEP = 0.001;
let anim = 0;
const startPlottingPhasePotriats = () => {
    ctx;
    // prevPoints = points.slice(0);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    for (let i = 0; i < points.length; i++) {
        const x = points[i][0];
        const y = points[i][1];
        // Use RK4
        const k1x = xdot(x, y);
        const k1y = ydot(x, y);
        const k2x = xdot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y);
        const k2y = ydot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y);
        const k3x = xdot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y);
        const k3y = ydot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y);
        const k4x = xdot(x + TIME_STEP * k3x, y + TIME_STEP * k3y);
        const k4y = ydot(x + TIME_STEP * k3x, y + TIME_STEP * k3y);
        const newX = x + TIME_STEP / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
        const newY = y + TIME_STEP / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
        points[i][0] = newX;
        points[i][1] = newY;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.moveTo(...mapSpaceToCanvas(x, y));
        ctx.lineTo(...mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();
    }
    anim = requestAnimationFrame(startPlottingPhasePotriats);
};
const NUMBER_OF_POINTS = 2000;
// drawDirectionField();
button1.addEventListener("click", () => {
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
    xdot = (x, y) => {
        return -2 * Math.cos(x) - Math.cos(y);
    };
    ydot = (x, y) => {
        return -2 * Math.cos(y) - Math.cos(x);
    };
    // console.log("Button clicked");
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
    // // ctx.strokeStyle = "black";
    // ctx.lineWidth = 1;
    // button1.style.display = "none";
});
button2.addEventListener("click", () => {
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
    xdot = (x, y) => {
        return y;
    };
    ydot = (x, y) => {
        return -x + y * (1 - x ** 2);
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
button3.addEventListener("click", () => {
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
    xdot = (x, y) => {
        return 2 * x * y;
    };
    ydot = (x, y) => {
        return y ** 2 - x ** 2;
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
button4.addEventListener("click", () => {
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
    xdot = (x, y) => {
        return y + y ** 2;
    };
    ydot = (x, y) => {
        return -x / 2 + y / 5 - x * y + (6 / 5) * (y ** 2);
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
button5.addEventListener("click", () => {
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
    xdot = (x, y) => {
        return y + y ** 2;
    };
    ydot = (x, y) => {
        return -x + (1 / 5) * y - x * y + (6 / 5) * (y ** 2);
    };
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
});
