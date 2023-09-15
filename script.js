// Define constants for directions
const NORTH = "NORTH";
const SOUTH = "SOUTH";
const EAST = "EAST";
const WEST = "WEST";

// Initialize toy drone state
let x = 0;
let y = 0;
let direction = NORTH;

//Co-ordinates for the rotation
let globalX = 0;
let globalY = 0;
//let newX = 0;
//let newY = 0;

function placeDrone(x, y, direction) {
  if (isValidPosition(x, y) && isValidDirection(direction)) {
    updatePosition(x, y, direction);
    updateGrid();
  }
}

// Initialize grid
const grid = document.querySelector(".grid");

// Add event listeners to grid cells for initial drone placement
const gridCells = document.querySelectorAll(".grid-cell");
gridCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    placeDrone(x, y, direction);
  });
});

for (let i = 0; i < 100; i++) {
  const cell = document.createElement("div");
  cell.classList.add("grid-cell");
  grid.appendChild(cell);
}

function updatePosition(newX, newY, newDirection) {
  globalX = newX;
  globalY = newY;
  x = newX;
  y = newY;
  direction = newDirection;
}

function executeCommand(command) {
  const parts = command.trim().toUpperCase().split(" ");

  if (parts.length > 0) {
    const action = parts[0];
    switch (action) {
      case "PLACE":
        if (parts.length === 2) {
          const args = parts[1].split(",");
          if (args.length === 3) {
            globalX = parseInt(args[0]);
            globalY = parseInt(args[1]);
            const newDirection = args[2];
            if (
              isValidPosition(globalX, globalY) &&
              isValidDirection(newDirection)
            ) {
              updatePosition(globalX, globalY, newDirection);
              updateGrid();
            }
          }
        }
        break;
      case "MOVE":
        move();
        break;
      case "LEFT":
        rotateLeft();
        break;
      case "RIGHT":
        rotateRight();
        break;
      case "REPORT":
        reportPosition();
        break;
      case "ATTACK":
        attack();
        break;
      default:
        break;
    }
  }
}

function isValidPosition(x, y) {
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}

function isValidDirection(dir) {
  return [NORTH, SOUTH, EAST, WEST].includes(dir);
}

function move() {
  let newX = x;
  let newY = y;

  switch (direction) {
    case NORTH:
      newY--;
      break;
    case SOUTH:
      newY++;
      break;
    case EAST:
      newX++;
      break;
    case WEST:
      newX--;
      break;
    default:
      break;
  }

  if (isValidPosition(newX, newY)) {
    updatePosition(newX, newY, direction);
    updateGrid();
  }
}

function rotateLeft() {
  switch (direction) {
    case NORTH:
      direction = WEST;
      break;
    case SOUTH:
      direction = EAST;
      break;
    case EAST:
      direction = NORTH;
      break;
    case WEST:
      direction = SOUTH;
      break;
    default:
      break;
  }

  if (isValidPosition(globalX, globalY) && isValidDirection(direction)) {
    updatePosition(globalX, globalY, direction);
    updateGrid();
  }
}

function rotateRight() {
  switch (direction) {
    case NORTH:
      direction = EAST;
      break;
    case SOUTH:
      direction = WEST;
      break;
    case EAST:
      direction = SOUTH;
      break;
    case WEST:
      direction = NORTH;
      break;
    default:
      break;
  }

  if (isValidPosition(globalX, globalY) && isValidDirection(direction)) {
    updatePosition(globalX, globalY, direction);
    updateGrid();
  }
}

function reportPosition() {
  const outputText = document.getElementById("outputText");
  outputText.innerText = `Output: ${x}, ${y}, ${direction}`;
}

function updateGrid() {
  const cells = grid.getElementsByClassName("grid-cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].classList.remove("drone");
  }
  const index = y * 10 + x;
  if (index >= 0 && index < cells.length) {
    const droneCell = cells[index];
    const droneImage = document.createElement("img");
    droneImage.src = "icons8-drone-64.png";

    droneCell.appendChild(droneImage);
    droneCell.classList.add("drone");
    droneCell.dataset.direction = direction;
    updateDroneImage();
  }
}

function resetGrid() {
  const cells = grid.getElementsByClassName("grid-cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].classList.remove("drone");
  }
}

function attack() {
  let attackX = x;
  let attackY = y;

  switch (direction) {
    case NORTH:
      attackY -= 2;
      break;
    case SOUTH:
      attackY += 2;
      break;
    case EAST:
      attackX += 2;
      break;
    case WEST:
      attackX -= 2;
      break;
    default:
      break;
  }

  if (isValidPosition(attackX, attackY)) {
    const cells = grid.getElementsByClassName("grid-cell");
    const index = attackY * 10 + attackX;
    cells[index].innerText = "X";
  }
}

const executeButton = document.getElementById("executeCommand");
executeButton.addEventListener("click", () => {
  const commandInput = document.getElementById("commandInput");
  executeCommand(commandInput.value);
  commandInput.value = "";
});

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
  updatePosition(0, 0, NORTH);
  resetGrid();
  document.getElementById("outputText").innerText = "";
});

function updateDroneImage() {
  const droneImages = {
    NORTH: "icons8-drone-64.png",
    SOUTH: "icons8-drone-64-south.png",
    EAST: "icons8-drone-64-east.png",
    WEST: "icons8-drone-64-west.png",
  };

  const droneImage = document.querySelector(".drone-image");
  if (droneImage) {
    droneImage.src = droneImages[direction]; // Set the image source based on direction
  }
}
