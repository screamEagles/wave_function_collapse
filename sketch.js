// Source image
let sourceImage;
// Tiles extracted from the source image
let tiles;
// Grid of cells for the Wave Function Collapse algorithm
let grid;

// Refactored variables names
// Number of cells along one dimension of the grid
let GRID_SIZE = 40;
// Maximum depth for recursive checking of cells
let MAX_RECURSION_DEPTH = 5;
// Size of each tile (3x3 by default)
let TILE_SIZE = 3;
let w;

function preload() {
  sourceImage = loadImage("images/Water.png");
}

function setup() {
  createCanvas(400, 400);
  // Cell width based on canvas size and grid size
  w = width / GRID_SIZE;

  // Extract tiles and calculate their adjacencies
  tiles = extractTiles(sourceImage);
  for (let tile of tiles) {
    tile.calculateNeighbors(tiles);
  }

  // Create the grid
  initializeGrid();

  // Perform initial wave function collapse step
  wfc();

  // The wfc function only collapses one cell at a time
  // This extra bit collapses any other cells that can be
  for (let cell of grid) {
    if (cell.options.length == 1) {
      cell.collapsed = true;
      reduceEntropy(grid, cell, 0);
    }
  }
}

function initializeGrid() {
  grid = [];
  // Initialize the grid with cells
  let count = 0;
  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      grid.push(new Cell(tiles, i * w, j * w, w, count));
      count++;
    }
  }
}

function draw() {
  background(0);

  // Show the grid
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
    // Reset all cells to "unchecked"
    grid[i].checked = false;
  }

  // Run Wave Function Collapse
  wfc();
}

// The Wave Function Collapse algorithm
function wfc() {
  // Find cells with the lowest entropy (simplified as fewest options left)
  // Thie refactored method to find the lowest entropy cells avoids sorting
  let minEntropy = Infinity;
  let lowestEntropyCells = [];

  for (let cell of grid) {
    if (!cell.collapsed) {
      if (cell.options.length < minEntropy) {
        minEntropy = cell.options.length;
        lowestEntropyCells = [cell];
      } else if (cell.options.length === minEntropy) {
        lowestEntropyCells.push(cell);
      }
    }
  }

  // Randomly select one of the lowest entropy cells to collapse
  const cell = random(lowestEntropyCells);
  cell.collapsed = true;

  // Choose one option randomly from the cell's options
  const pick = random(cell.options);

  // If there are no possible tiles that fit there!
  if (pick == undefined) {
    console.log("ran into a conflict");
    initializeGrid();
    return;
  }

  // Set the final tile
  cell.options = [pick];

  // Propagate entropy reduction to neighbors
  reduceEntropy(grid, cell, 0);
}

function reduceEntropy(grid, cell, depth) {
  // Stop propagation if max depth is reached or cell already checked
  if (depth > MAX_RECURSION_DEPTH || cell.checked) return;

  // Mark cell as checked
  cell.checked = true;

  let index = cell.index;
  let i = floor(index % GRID_SIZE);
  let j = floor(index / GRID_SIZE);

  // Update neighboring cells based on adjacency rules
  // RIGHT
  if (i + 1 < GRID_SIZE) {
    let rightCell = grid[i + 1 + j * GRID_SIZE];
    if (checkOptions(cell, rightCell, EAST)) {
      reduceEntropy(grid, rightCell, depth + 1);
    }
  }

  // LEFT
  if (i - 1 >= 0) {
    let leftCell = grid[i - 1 + j * GRID_SIZE];
    if (checkOptions(cell, leftCell, WEST)) {
      reduceEntropy(grid, leftCell, depth + 1);
    }
  }

  // DOWN
  if (j + 1 < GRID_SIZE) {
    let downCell = grid[i + (j + 1) * GRID_SIZE];
    if (checkOptions(cell, downCell, SOUTH)) {
      reduceEntropy(grid, downCell, depth + 1);
    }
  }

  // UP
  if (j - 1 >= 0) {
    let upCell = grid[i + (j - 1) * GRID_SIZE];
    if (checkOptions(cell, upCell, NORTH)) {
      reduceEntropy(grid, upCell, depth + 1);
    }
  }
}

function checkOptions(cell, neighbor, direction) {
  // Check if the neighbor is valid and not already collapsed
  if (neighbor && !neighbor.collapsed) {
    // Collect valid options based on the current cell's adjacency rules
    let validOptions = [];
    for (let option of cell.options) {
      validOptions = validOptions.concat(tiles[option].neighbors[direction]);
    }

    // Filter the neighbor's options to retain only those that are valid
    neighbor.options = neighbor.options.filter((elt) =>
      validOptions.includes(elt)
    );
    return true;
  } else {
    return false;
  }
}
