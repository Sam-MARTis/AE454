
const canvas = document.getElementById("projectCanvas") as HTMLCanvasElement;
canvas.width = window.innerWidth*devicePixelRatio;
canvas.height = window.innerHeight*devicePixelRatio;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const button1 = document.getElementById("but1") as HTMLButtonElement;
const button2 = document.getElementById("but2") as HTMLButtonElement;
const button3 = document.getElementById("but3") as HTMLButtonElement;

const TIME_STEP = 0.1;
const NUMBER_OF_POINTS = 1000;


const xMin = -2;
const xMax = 2;
const yMin = -2;
const yMax = 2;

const mapCanvasToSpace = (xCanvas: number, yCanvas: number): [number, number] => {
    const xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    const ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
}
const mapSpaceToCanvas = (xSpace: number, ySpace: number): [number, number] => {
    const xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    const yCanvas = ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
}

if(!ctx){
    throw Error("Context unable to be found");
}

let xdot = (x: number, y: number) => {
    return y
}
let ydot = (x: number, y: number, mu: number = -0.90) => {
    return mu*y + x - x**3  + x*y
}


const initializeSeedPoints = (xmin: number, xmax: number, ymin: number, ymax: number, pointCount: number) => {
    const seedPoints: [number, number][] = [];
    for(let i=0; i<pointCount; i++){
        const x = Math.random() * (xmax - xmin) + xmin;
        const y = Math.random() * (ymax - ymin) + ymin;
        seedPoints.push([x, y]);
    }
    return seedPoints;
}

let points: number[][] = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
let anim: number = 0;
const startPlottingPhasePotriats = (mu: number) => {
    // prevPoints = points.slice(0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.005)"; // Try 0.02 to 0.1 depending on trail speed
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    for(let i=0; i<points.length; i++){
        const x = points[i][0];
        const y = points[i][1];
        // Use RK4
        const k1x = xdot(x, y);
        const k1y = ydot(x, y, mu);
        const k2x = xdot(x + TIME_STEP/2*k1x, y + TIME_STEP/2*k1y);
        const k2y = ydot(x + TIME_STEP/2*k1x, y + TIME_STEP/2*k1y, mu);
        const k3x = xdot(x + TIME_STEP/2*k2x, y + TIME_STEP/2*k2y);
        const k3y = ydot(x + TIME_STEP/2*k2x, y + TIME_STEP/2*k2y, mu);
        const k4x = xdot(x + TIME_STEP*k3x, y + TIME_STEP*k3y);
        const k4y = ydot(x + TIME_STEP*k3x, y + TIME_STEP*k3y, mu);
        const newX = x + TIME_STEP/6*(k1x + 2*k2x + 2*k3x + k4x);
        const newY = y + TIME_STEP/6*(k1y + 2*k2y + 2*k3y + k4y);
        points[i][0] = newX;
        points[i][1] = newY;
        ctx.beginPath();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "blue";
        ctx.moveTo(...mapSpaceToCanvas(x, y));
        ctx.lineTo(...mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();


    }

    anim = requestAnimationFrame(() => {startPlottingPhasePotriats(mu)});


}


const muVals = [-0.92, -0.8645, -0.80];
// drawDirectionField();
button1.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
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
}
);

button2.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
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

button3.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
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

const initializeSomePoints = (pointsToReset: number = 80) => {
    const range = points.length;
    for(let i=0; i<pointsToReset; i++){
        const x = Math.random() * (xMax - xMin) + xMin;
        const y = Math.random() * (yMax - yMin) + yMin;
        points[Math.floor(Math.random()*range)] = [x, y];
    }

}


setInterval(()=> {
    // points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    initializeSomePoints(100);
}, 500)