const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
let maze, path;

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height; // Fix here
        this.grid = [];
        this.visited = [];

        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            this.visited[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = 1;
                this.visited[y][x] = false;
            }
        }

        this.start = { x: 0, y: 0 };
        this.end = { x: width - 1, y: height - 1 };
    }

    generateMaze() {
        let stack = [this.start];
        this.visited[this.start.y][this.start.x] = true;
        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];

        while (stack.length > 0) {
            let current = stack.pop();
            let neighbors = this.getUnvisitedNeighbors(current);

            if (neighbors.length > 0) {
                stack.push(current);
                let next = neighbors[Math.floor(Math.random() * neighbors.length)]; // Fix here
                if (next) {
                    this.removeWall(current, next);
                    this.visited[next.y][next.x] = true;
                    stack.push(next);
                }
            }
        }
    }

    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        if (x > 1 && !this.visited[y][x - 2]) {
            neighbors.push({ x: x - 2, y: y });
        }
        if (x < this.width - 2 && !this.visited[y][x + 2]) {
            neighbors.push({ x: x + 2, y: y });
        }
        if (y > 1 && !this.visited[y - 2][x]) {
            neighbors.push({ x: x, y: y - 2 });
        }
        if (y < this.height - 2 && !this.visited[y + 2][x]) {
            neighbors.push({ x: x, y: y + 2 });
        }
        return neighbors;
    }

    removeWall(current, next) {
        let x = (current.x + next.x) / 2;
        let y = (current.y + next.y) / 2;
        
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            this.grid[y][x] = 0;
            this.grid[next.y][next.x] = 0;
        } else {
            console.error("error");
        }
    }
}

function drawMaze(maze) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) { // Fix here
            ctx.fillStyle = maze[y][x] === 1 ? 'rgba(29, 26, 26, 0.942)' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawBot(position) {
    ctx.fillStyle = 'rgba(12, 80, 168, 0.932)';
    ctx.fillRect(position.x * cellSize, position.y * cellSize, cellSize, cellSize);
}

function setup() {
    maze = new Maze(25, 25);
    maze.generateMaze();
    drawMaze(maze.grid);
}

function animateBot(path, speed = 200) {  // Default speed set to 200ms delay
    let i = 0;
    function step() {
        if (i < path.length) {
            let position = path[i];
            drawMaze(maze.grid);
            drawBot(position);
            i++;
            setTimeout(step, speed);  // Use setTimeout to control the delay
        }
    }
    step();
}

function startBotMovement() {
    let start = { x: 0, y: 0 };
    let end = { x: 24, y: 24 };
    path = solveDFS(maze.grid, start, end);
    animateBot(path);
}

function solveDFS(maze, start, end) {
    let stack = [start];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`); // Fix here
    let path = [];

    while (stack.length > 0) {
        let current = stack.pop();
        path.push(current);

        if (current.x === end.x && current.y === end.y) {
            return path;
        }

        let neighbors = getNeighbors(maze, current);
        for (let neighbor of neighbors) {
            let key = `${neighbor.x},${neighbor.y}`; // Fix here
            if (!visited.has(key)) {
                visited.add(key);
                stack.push(neighbor);
            }
        }
    }
    return path;
}

function getNeighbors(maze, cell) {
    const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 }
    ];

    let neighbors = []; 
    for (let dir of directions) {
        let x = cell.x + dir.x;
        let y = cell.y + dir.y;
        if (x >= 0 && y >= 0 && x < maze[0].length && y < maze.length && maze[y][x] === 0) { // Fix here
            neighbors.push({ x, y });
        }
    }
    return neighbors;
}

setup();
startBotMovement();
