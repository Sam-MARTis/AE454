
const canvas = document.getElementById("projectCanvas") as HTMLCanvasElement;
canvas.width = window.innerWidth*devicePixelRatio;
canvas.height = window.innerHeight*devicePixelRatio;
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const button1 = document.getElementById("but1") as HTMLButtonElement;
const button2 = document.getElementById("but2") as HTMLButtonElement;
const button3 = document.getElementById("but3") as HTMLButtonElement;

const TIME_STEP = 0.01;
const NUMBER_OF_POINTS = 5000;


let xMin = -5;
let xMax = 5;
let yMin = -5;
let yMax = 5;


const mapCanvasToSpace = (xCanvas: number, yCanvas: number): [number, number] => {
    const xSpace = (xCanvas / canvas.width) * (xMax - xMin) + xMin;
    const ySpace = (yCanvas / canvas.height) * (yMax - yMin) + yMin;
    return [xSpace, ySpace];
}
const mapSpaceToCanvas = (xSpace: number, ySpace: number): [number, number] => {
    const xCanvas = ((xSpace - xMin) / (xMax - xMin)) * canvas.width;
    const yCanvas = canvas.height - ((ySpace - yMin) / (yMax - yMin)) * canvas.height;
    return [xCanvas, yCanvas];
}

if(!ctx){
    throw Error("Context unable to be found");
}

let xdot = (x: number, y: number) => {
    return y
}
let ydot = (x: number, y: number) => {
    return x
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
const startPlottingPhasePotriats = () => {
    // prevPoints = points.slice(0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)"; // Try 0.02 to 0.1 depending on trail speed
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    // ctx.lineWidth = 1;
    for(let i=0; i<points.length; i++){
        const x = points[i][0];
        const y = points[i][1];
        // Use RK4
        const k1x = xdot(x, y);
        const k1y = ydot(x, y);
        const k2x = xdot(x + TIME_STEP/2*k1x, y + TIME_STEP/2*k1y);
        const k2y = ydot(x + TIME_STEP/2*k1x, y + TIME_STEP/2*k1y);
        const k3x = xdot(x + TIME_STEP/2*k2x, y + TIME_STEP/2*k2y);
        const k3y = ydot(x + TIME_STEP/2*k2x, y + TIME_STEP/2*k2y);
        const k4x = xdot(x + TIME_STEP*k3x, y + TIME_STEP*k3y);
        const k4y = ydot(x + TIME_STEP*k3x, y + TIME_STEP*k3y);
        const newX = x + TIME_STEP/6*(k1x + 2*k2x + 2*k3x + k4x);
        const newY = y + TIME_STEP/6*(k1y + 2*k2y + 2*k3y + k4y);
        points[i][0] = newX;
        points[i][1] = newY;
        ctx.beginPath();
        // ctx.lineWidth = 0.2;
        ctx.strokeStyle = "blue";
        ctx.moveTo(...mapSpaceToCanvas(x, y));
        ctx.lineTo(...mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();


    }

    anim = requestAnimationFrame(() => {startPlottingPhasePotriats()});


}




// drawDirectionField();
button1.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "red";

    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    // ctx.moveTo(0, canvas.height/2);
    // ctx.lineTo(canvas.width, canvas.height/2);
    // ctx.stroke();
    ctx.strokeStyle = "blue";

    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);
    xdot = (x: number, y: number) => {
        return y;
    }
    ydot = (x: number, y: number) => {
        return 3 - y**2 - x;
    }
    ctx.lineWidth = 0.4;

    startPlottingPhasePotriats();


    // // ctx.strokeStyle = "black";
    // ctx.lineWidth = 1;
    // button1.style.display = "none";
}
);

button2.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "red";

    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    // ctx.moveTo(0, canvas.height/2);
    // ctx.lineTo(canvas.width, canvas.height/2);
    // ctx.stroke();
    xdot = (x: number, y: number) => {
        return y - y**3;
    }
    ydot = (x: number, y: number) => {
        return x*Math.cos(y);
    }
    ctx.strokeStyle = "blue";

    // (a) ˙x = y + μx, ˙y = −x + μy − xy

    ctx.lineWidth = 0.5;
    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);

    startPlottingPhasePotriats();
});

button3.addEventListener("click", () => {
    cancelAnimationFrame(anim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "red";

    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    // ctx.moveTo(0, canvas.height/2);
    // ctx.lineTo(canvas.width, canvas.height/2);
    // ctx.stroke();
    xdot = (x: number, y: number) => {
        return Math.sin(y);
    }
    ydot = (x: number, y: number) => {
        return y**2 - x;
    }
    xMin = -5;
    yMin = -10;
    xMax = 30;
    yMax = 10;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 0.5;

    points = initializeSeedPoints(xMin, xMax, yMin, yMax, NUMBER_OF_POINTS);

    startPlottingPhasePotriats();
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
}, 100)

