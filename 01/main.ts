
const canvas = document.getElementById("projectCanvas") as HTMLCanvasElement;
canvas.width = window.innerWidth*devicePixelRatio;
canvas.height = window.innerHeight*devicePixelRatio;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const buttonElement = document.getElementById("startButton") as HTMLButtonElement;


const xMin = -5;
const xMax = 5;
const yMin = -5;
const yMax = 5;

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

const xdot = (x: number, y: number) => {
    return x + Math.exp(-y)
}
const ydot = (x: number, y: number) => {
    return -y
}

const drawDirectionField = () => {
    ctx.strokeStyle = "red";
    console.log("Drawing direction field");
    for(let i=xMin; i<xMax; i+=0.2){
        for(let j=yMin; j<yMax; j+=0.2){
            const x = i;
            const y = j;
            const xdotValue = xdot(x, y);
            const ydotValue = ydot(x, y);
            let length = (Math.sqrt(xdotValue**2 + ydotValue**2))**0.5;
            const drawLength = 0.1;
            ctx.strokeStyle = `rgb(${length*50}, 0, ${255- length*50})`;
            // if(length > 1){
            //     length = 0;
            // }
            if(length < 0.1){
                length = 0.1;
            }
            const angle = Math.atan2(ydotValue, xdotValue);


            ctx.beginPath();
            ctx.moveTo(...mapSpaceToCanvas(x, y));
            ctx.lineTo(...mapSpaceToCanvas(x + drawLength*Math.cos(angle), y + drawLength*Math.sin(angle)));
            ctx.stroke();
            ctx.arc(...mapSpaceToCanvas(x + drawLength*Math.cos(angle), y + drawLength*Math.sin(angle)), 2, 0, Math.PI*2);
            // ctx.fillStyle = "red";
            ctx.fill();
            // ctx.arcTo(...mapSpaceToCanvas(x + xdotValue/length*0.1, y + ydotValue/length*0.1), 2, 0, Math.PI*2);
            // ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
    
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

let points: number[][] = initializeSeedPoints(xMin, xMax, yMin, yMax, 2000);
const TIME_STEP = 0.003;

const startPlottingPhasePotriats = () => {
    ctx
    // prevPoints = points.slice(0);
    console.log("Plotting phase portraits");
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.moveTo(...mapSpaceToCanvas(x, y));
        ctx.lineTo(...mapSpaceToCanvas(newX, newY));
        // console.log("Drawing line from ", prevPoints[i], " to ", [newX, newY]);
        ctx.stroke();


    }

    requestAnimationFrame(startPlottingPhasePotriats);


}

drawDirectionField();
buttonElement.addEventListener("click", () => {
    console.log("Button clicked");
    startPlottingPhasePotriats();


    // ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    buttonElement.style.display = "none";
}
);

