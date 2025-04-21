"use strict";
const canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const ctx = canvas.getContext("2d");
const regenButton = document.getElementById("but4");
const clearTrailsButton = document.getElementById("but5");
const muInput = document.getElementById("muRange");
const muDisplay = document.getElementById("muDisplay");
const NUMBER_OF_POINTS = 30;
const fractionToUpdate = 0.1;
const lineWidth = 1;
const updateNo = Math.floor(NUMBER_OF_POINTS * fractionToUpdate);
const DEFAULT_TIME_STEP = 0.0001;
let TIME_STEP = DEFAULT_TIME_STEP;
const ITERS_PER_DRAW = 500;
let xMin = -2;
let xMax = 2;
let yMin = -2;
let yMax = 2;
let mu = -0.9;
const mapCanvasToSpace = (xCanvas, yCanvas) => {
    const xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    const ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
};
const mapSpaceToCanvas = (xSpace, ySpace) => {
    const xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    const yCanvas = canvas.height - ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
};
const mapPolarToCartesian = (r, th) => {
    const x = r * Math.cos(th);
    const y = r * Math.sin(th);
    return [x, y];
};
const mapCartesianToPolar = (x, y) => {
    const r = Math.sqrt(x ** 2 + y ** 2);
    const th = Math.atan2(y, x);
    return [r, th];
};
if (!ctx) {
    throw Error("Context unable to be found");
}
let rdot = (r, th, mu) => {
    return r * (1 - (r ** 2)) + mu * r * Math.cos(th);
    // return 0
};
let thdot = (r, th, mu) => {
    return 1;
};
const initializeSeedPoints = (xmin, xmax, ymin, ymax, pointCount) => {
    const seedPoints = [];
    for (let i = 0; i < pointCount; i++) {
        const x = Math.random() * (xmax - xmin) + xmin;
        const y = Math.random() * (ymax - ymin) + ymin;
        seedPoints.push(mapCartesianToPolar(x, y));
    }
    return seedPoints;
};
let OUTSIDE_CANVAS_RESPAWN = false;
let points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
let anim = 0;
const startPlottingPhasePotriats = () => {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    // prevPoints = points.slice(0);
    // console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
        const xOld = points[i][0];
        const yOld = points[i][1];
        for (let j = 0; j < ITERS_PER_DRAW; j++) {
            const x = points[i][0];
            const y = points[i][1];
            // Use RK4
            const k1x = rdot(x, y, mu);
            const k1y = thdot(x, y, mu);
            const k2x = rdot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y, mu);
            const k2y = thdot(x + TIME_STEP / 2 * k1x, y + TIME_STEP / 2 * k1y, mu);
            const k3x = rdot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y, mu);
            const k3y = thdot(x + TIME_STEP / 2 * k2x, y + TIME_STEP / 2 * k2y, mu);
            const k4x = rdot(x + TIME_STEP * k3x, y + TIME_STEP * k3y, mu);
            const k4y = thdot(x + TIME_STEP * k3x, y + TIME_STEP * k3y, mu);
            const newX = x + TIME_STEP / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
            const newY = y + TIME_STEP / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
            points[i][0] = newX;
            points[i][1] = newY;
        }
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "blue";
        ctx.moveTo(...mapSpaceToCanvas(...mapPolarToCartesian(xOld, yOld)));
        ctx.lineTo(...mapSpaceToCanvas(...mapPolarToCartesian(points[i][0], points[i][1])));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();
        if (OUTSIDE_CANVAS_RESPAWN) {
            const [xcheck, ycheck] = mapPolarToCartesian(points[i][0], points[i][1]);
            if (xcheck < xMin || xcheck > xMax || ycheck < yMin || ycheck > yMax) {
                const xRespawn = Math.random() * (xMax - xMin) + xMin;
                const yRespawn = Math.random() * (yMax - yMin) + yMin;
                const [respawnR, respawnTh] = mapCartesianToPolar(xRespawn, yRespawn);
                points[i][0] = respawnR;
                points[i][1] = respawnTh;
            }
        }
    }
    anim = requestAnimationFrame(startPlottingPhasePotriats);
};
// const muVals = [-0.92, -0.8645, -0.80];
const updateMu = () => {
    mu = parseFloat(muInput.value);
    muDisplay.innerHTML = mu.toFixed(6);
};
const main = () => {
    updateMu();
    initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    startPlottingPhasePotriats();
};
main();
// button1.addEventListener("click", () => {
//     cancelAnimationFrame(anim);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = "red";
//     ctx.moveTo(canvas.width/2, 0);
//     ctx.lineTo(canvas.width/2, canvas.height);
//     ctx.moveTo(0, canvas.height/2);
//     ctx.lineTo(canvas.width, canvas.height/2);
//     ctx.stroke();
//     ctx.strokeStyle = "blue";
//     TIME_STEP = DEFAULT_TIME_STEP/100;
//     xdot = (x: number, y: number, mu: number) => {
//         return y + mu*x;
//     }
//     ydot = (x: number, y: number, mu: number) => {
//         return -x + mu*y - x**y;
//     }
//     // console.log("Button clicked");
//     points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
//     startPlottingPhasePotriats();
//     // // ctx.strokeStyle = "black";
//     // ctx.lineWidth = 1;
//     // button1.style.display = "none";
// }
// );
// button2.addEventListener("click", () => {
//     cancelAnimationFrame(anim);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = "red";
//     ctx.moveTo(canvas.width/2, 0);
//     ctx.lineTo(canvas.width/2, canvas.height);
//     ctx.moveTo(0, canvas.height/2);
//     ctx.lineTo(canvas.width, canvas.height/2);
//     ctx.stroke();
//     ctx.strokeStyle = "blue";
//     TIME_STEP = DEFAULT_TIME_STEP;
//     xdot = (x: number, y: number, mu: number) => {
//         return y + mu*x - x**3;
//     }
//     ydot = (x: number, y: number, mu: number) => {
//         return -x + mu*y - 2*(y**3);
//     }
//     points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
//     startPlottingPhasePotriats();
// });
// button3.addEventListener("click", () => {
//     cancelAnimationFrame(anim);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = "red";
//     ctx.moveTo(canvas.width/2, 0);
//     ctx.lineTo(canvas.width/2, canvas.height);
//     ctx.moveTo(0, canvas.height/2);
//     ctx.lineTo(canvas.width, canvas.height/2);
//     ctx.stroke();
//     ctx.strokeStyle = "blue";
//     TIME_STEP = DEFAULT_TIME_STEP;
//     xdot = (x: number, y: number, mu: number) => {
//         return mu*x +y - x**2;
//     }
//     ydot = (x: number, y: number, mu: number) => {
//         return -x + mu*y - 2*(x**2);
//     }
//     points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
//     startPlottingPhasePotriats();
// });
regenButton.addEventListener("click", () => {
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
});
clearTrailsButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
const initializeSomePoints = (pointsToReset = 80) => {
    const range = points.length;
    for (let i = 0; i < pointsToReset; i++) {
        const x = Math.random() * (xMax - xMin) + xMin;
        const y = Math.random() * (yMax - yMin) + yMin;
        points[Math.floor(Math.random() * range)] = [x, y];
    }
};
muInput.addEventListener("input", () => {
    updateMu();
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
});
// setInterval(()=> {
//     // points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
//     initializeSomePoints(updateNo);
// }, 500)
setInterval(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)"; // Try 0.02 to 0.1 depending on trail speed
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 100); // 60 FPS
