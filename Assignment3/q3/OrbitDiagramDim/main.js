"use strict";
// Project: Lyapunov Exponent Visualizer
Object.defineProperty(exports, "__esModule", { value: true });
//Import quadtree from quadtree.ts
const QuadTree_1 = require("./QuadTree");
// const a = new QuadTree(0, 0, 100, 100, 4);
const canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const ctx = canvas.getContext("2d");
if (!ctx) {
    throw Error("Context unable to be found");
}
const rStartInput = document.getElementById("rStart");
const rEndInput = document.getElementById("rEnd");
const drInput = document.getElementById("dr");
const convergeIterationsInput = document.getElementById("convergeIterations");
const outputIterationsInput = document.getElementById("outputIterations");
const submitBtn = document.getElementById("submitBtn");
const mapTypeSelect = document.getElementById("mapType");
let rStart = 0;
let rEnd = 4;
let dr = 0.02;
const POINTS_PER_LEAF = 4;
let convergeIterations = 400;
let outputIterations = 2000;
let mapType = "logistic";
let tree;
const getUserMenuInputAndRender = () => {
    rStart = parseFloat(rStartInput.value);
    rEnd = parseFloat(rEndInput.value);
    dr = parseFloat(drInput.value);
    convergeIterations = parseInt(convergeIterationsInput.value);
    outputIterations = parseInt(outputIterationsInput.value);
    mapType = mapTypeSelect.value;
    // console.log(rStart, rEnd, dr, convergeIterations, outputIterations);
    const rVals = initializeXAxis(rStart, rEnd, dr);
    render(rVals, convergeIterations, outputIterations, mapType);
};
//Step size
const RSU_W = 0.8; //Ratio of screen width used
const RSU_H = 0.8; //Ratio of screen height used
// const yScalle = 10
const drawTree = (tree, xMin, yMin, length, height, scaleX, scaleY) => {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.rect((tree.x - xMin) * scaleX, (tree.y - yMin) * scaleY, tree.width * scaleX, tree.height * scaleY);
    ctx.stroke();
    ctx.closePath();
    if (tree.divided) {
        tree.subTrees.forEach((subTree) => {
            drawTree(subTree, xMin, yMin, length, height, scaleX, scaleY);
        });
    }
};
const performItertationMap = (xstart, r, iterations, returnIterations = 1, mapType = "logistic") => {
    if (returnIterations > iterations) {
        throw Error("returnIterations must be less than or equal to iterations");
    }
    let x = xstart;
    const xVals = new Array(returnIterations).fill(null);
    xVals[0] = x;
    let refPoint = 1;
    if (mapType == "logistic") {
        x = r * x * (1 - x);
        for (let i = 0; i < iterations; i++) {
            x = r * x * (1 - x);
            xVals[refPoint] = x;
            refPoint = (refPoint + 1) - returnIterations * Number(refPoint == returnIterations - 1);
        }
    }
    else if (mapType == "sine") {
        const pi = Math.PI;
        for (let i = 0; i < iterations; i++) {
            x = r * Math.sin(x * pi);
            xVals[refPoint] = x;
            refPoint = (refPoint + 1) - returnIterations * Number(refPoint == returnIterations - 1);
        }
    }
    else {
        throw Error("Unknown maptype in perormIterationMap function");
    }
    const returnList = new Array(returnIterations).fill(null);
    for (let i = 0; i < returnIterations; i++) {
        returnList[i] = xVals[(refPoint + i) % returnIterations];
    }
    return returnList;
};
const calculateLyapunov = (r, xVals, mapType = "logistic") => {
    const n = xVals.length;
    const lnX = new Array(n).fill(null);
    const pi = Math.PI;
    if (mapType == "logistic") {
        for (let i = 0; i < n; i++) {
            lnX[i] = Math.log(Math.abs(r * (1 - 2 * xVals[i])));
        }
    }
    else if (mapType == "sine") {
        for (let i = 0; i < n; i++) {
            lnX[i] = Math.log(Math.abs(r * pi * Math.cos(pi * xVals[i])));
        }
    }
    const sum = lnX.reduce((acc, val) => acc + val, 0);
    const lyapunovExp = sum / n;
    return lyapunovExp;
};
// console.log(performItertationMap(0.5, 3.5, 1000, 10));
const initializeXAxis = (rmin, rmax, dx) => {
    const xVals = new Array(Math.floor((rmax - rmin) / dx)).fill(null);
    for (let i = 0; i < xVals.length; i++) {
        xVals[i] = rmin + i * dx;
    }
    return xVals;
};
const render = (rVals, convergeIterations, outputIterations, mapType) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    const rmin = Math.min(...rVals);
    const rmax = Math.max(...rVals);
    tree = new QuadTree_1.QuadTree(rmin, 0, rmax - rmin, 1, POINTS_PER_LEAF);
    const xScale = RSU_W * canvas.width / (rmax - rmin);
    const yScale = RSU_H * canvas.height;
    const xPad = canvas.width * (1 - RSU_W) / 2;
    const yPad = canvas.height * (1 - RSU_H) / 2;
    const randomInitials = new Array(rVals.length).fill(null);
    for (let i = 0; i < rVals.length; i++) {
        randomInitials[i] = Math.random();
    }
    // console.log("rvals", rVals);
    const lyapunovExps = new Array(rVals.length).fill(null);
    for (let i = 0; i < rVals.length; i++) {
        const r = rVals[i];
        const x = performItertationMap(randomInitials[i], r, outputIterations, outputIterations, mapType);
        const finalXVals = x.slice(convergeIterations);
        // lyapunovExps[i] = calculateLyapunov(r, x, mapType);
        const xPos = xPad + (r - rmin) * xScale;
        ctx.fillStyle = "white";
        // for(let j = 0; j< finalXVals.length; j++){
        //     const yPos = canvas.height-yPad - (finalXVals[j] * yScale);
        //     ctx.fillRect(xPos, yPos, 0.1, 0.1);          
        // }
        for (let j = 0; j < finalXVals.length; j++) {
            const yPos = finalXVals[j];
            const xPos = rVals[i];
            tree.addPoint([xPos, yPos]);
        }
    }
    drawTree(tree, rmin, 0, rmax - rmin, 1, xScale, yScale);
    /*
    // Lyapunov Exponent Calculation
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    const yRef = canvas.height - yPad*3;
    ctx.moveTo(xPad, yRef);
    ctx.lineTo(canvas.width-xPad, yRef);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPad, yRef);
    ctx.strokeStyle = "green";
    ctx.moveTo(xPad, canvas.height-yPad);
    for(let j = 0; j< rVals.length; j++){
        const yPos = yRef - (lyapunovExps[j] * yScale)/10;
        const xPos = xPad + (rVals[j]-rmin) * xScale;
        ctx.lineTo(xPos, yPos);
        ctx.moveTo(xPos, yPos);



    }

    */
    ctx.stroke();
    // console.log("done");
};
// const dr = 0.002 
const rVals = initializeXAxis(0, 4, dr);
// const convergeIterations = 400;
// const outputIterations = 2000;
// const iterations = 1000;
// render(rVals, convergeIterations, outputIterations);
getUserMenuInputAndRender();
submitBtn.addEventListener("click", getUserMenuInputAndRender);
