
// Render an image with "block" pixels
function renderImage(img, x, y, w) {
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      fill(r, g, b);
      stroke(50);
      square(x + i * w, y + j * w, w);
    }
  }

  noFill();
  strokeWeight(1);
  stroke(0, 255, 255);
  square(x, y, img.width * w);
}

// Render only the center pixel of an image
function renderCell(img, x, y, w) {
  let i = floor(img.width / 2);
  let j = floor(img.width / 2);
  let index = (i + j * img.width) * 4;
  let r = img.pixels[index + 0];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  fill(r, g, b);
  noStroke();
  square(x, y, w);
}

// Extract tiles from the source image
function extractTiles(img) {
  let tiles = [];
  img.loadPixels();
  for (let j = 0; j < img.height; j++) {
    for (let i = 0; i < img.width; i++) {
      // Create a new image for each tile
      let tileImage = createImage(TILE_SIZE, TILE_SIZE);
      // Copy segment of source image
      copyTile(img, i, j, TILE_SIZE, tileImage);
      // Add to the array
      tiles.push(new Tile(tileImage, tiles.length));
    }
  }
  return tiles;
}

// Copy a tile from a source image to a new image
function copyTile(source, sx, sy, w, dest) {
  dest.loadPixels();
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < w; j++) {
      let pixelI = (sx + i) % source.width;
      let pixelJ = (sy + j) % source.height;
      let sourceIndex = (pixelI + pixelJ * source.width) * 4;
      let r = source.pixels[sourceIndex + 0];
      let g = source.pixels[sourceIndex + 1];
      let b = source.pixels[sourceIndex + 2];
      let a = source.pixels[sourceIndex + 3];
      let destIndex = (i + j * dest.width) * 4;
      dest.pixels[destIndex + 0] = r;
      dest.pixels[destIndex + 1] = g;
      dest.pixels[destIndex + 2] = b;
      dest.pixels[destIndex + 3] = a;
    }
  }
  dest.updatePixels();
}
