/*Conway's Game of Life
 * By Jared Swislow
 * 
 * Configurable amount of cells and canvas size
 * Has finite size; acts as if cells outside of bounds are dead
 * 
 * Made using p5.js
 *
 * Room for improvement:
 *	-Instead of using tempGrid, use a temporary 2D array of integers for performance
 */


//Preprocessor rules for JSLint and ESLint

/*eslint no-console: off*/
/*eslint-env browser*/
/*jslint node: true */
/*global background*/
/*global createCanvas*/
/*global Cell*/
/*global mouseX*/
/*global mouseY*/
/*global floor*/
/*global createButton*/
/*exported setup*/
/*exported draw*/
/*exported mousePressed*/
"use strict";

var CANVAS_SIZE = 400;
var EXTRA_RIGHT = 100;

var ROW_AMT = 30;
var COL_AMT = 30;

var grid;
var tempGrid;

//Evolves the cell in the ith column and jth row
//Places new data for cell in tempGrid
function evolveCell(i, j) {
	var numAliveNeighbors = 0;
	var offsetX, offsetY;
	
	//Find number of alive neighbors
	for (offsetX = -1; offsetX <= 1; offsetX += 1) {
		for (offsetY = -1; offsetY <= 1; offsetY += 1) {
			//Checing if neigbor with given offset is within bounds
			if (0 <= i + offsetX && i + offsetX < COL_AMT && 0 <= j + offsetY && j + offsetY < ROW_AMT) {
				//Checks if there is an offset (so we don't check ourselves) and if the neigbor is alive
				if ((offsetX || offsetY) && grid[i + offsetX][j + offsetY].alive) {
					numAliveNeighbors += 1;
				}
			}
		}
	}
	
	//Evolve based on number of alive neighbors and whether the cell is currently alive or dead
	if (grid[i][j].alive) {
		switch (numAliveNeighbors) {
			case 0:
			case 1:
				//Dies by solitude
				tempGrid[i][j].alive = false;
			break;
			case 2:
			case 3:
				//Survives
				tempGrid[i][j].alive = true;
			break;
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
				//Dies by overpopulation
				tempGrid[i][j].alive = false;
			break;
			default:
				//Incorrect neighbor count
				console.log("Incorrect neighbor count when evolving at ", i, ", ", j);
		}
	} else {
		//For a dead cell, if it has exactly 3 neigbors, it becomes alive
		if (numAliveNeighbors === 3) {
			tempGrid[i][j].alive = true;
		}
	}
}

function iterate() {
	var i, j;
	for (i = 0; i < COL_AMT; i += 1) {
		for (j = 0; j < ROW_AMT; j += 1) {
			evolveCell(i, j);
		}
	}
	//Copy tempGrid (made by evolveCell) to grid
	for (i = 0; i < COL_AMT; i += 1) {
		for (j = 0; j < ROW_AMT; j += 1) {
			grid[i][j].alive = tempGrid[i][j].alive;
		}
	}
}

function setup() {
	var i, j;
	var buttonIterateOnce;
	var blockSize;
	
	createCanvas(CANVAS_SIZE + EXTRA_RIGHT, CANVAS_SIZE);
	
	//Initialize grid
	grid = new Array(COL_AMT);
	for (i = 0; i < COL_AMT; i += 1) {
		grid[i] = new Array(ROW_AMT);
	}
	blockSize = CANVAS_SIZE / (COL_AMT < ROW_AMT ? ROW_AMT : COL_AMT);
	for (i = 0; i < COL_AMT; i += 1) {
		for (j = 0; j < ROW_AMT; j += 1) {
			grid[i][j] = new Cell(i * blockSize, j * blockSize, blockSize);
		}
	}
	//Initialize tempGrid for use when evolving cells
	tempGrid = new Array(COL_AMT);
	for (i = 0; i < COL_AMT; i += 1) {
		tempGrid[i] = new Array(ROW_AMT);
	}
	for (i = 0; i < COL_AMT; i += 1) {
		for (j = 0; j < ROW_AMT; j += 1) {
			tempGrid[i][j] = new Cell(i * blockSize, j * blockSize, blockSize);
		}
	}
	//Initiliaze buttons
	buttonIterateOnce = createButton("Iterate once");
	buttonIterateOnce.position(CANVAS_SIZE + 5, 10);
	buttonIterateOnce.mousePressed(iterate);
}


function draw() {
	var i, j;
	background(222);
	for (i = 0; i < COL_AMT; i += 1) {
		for (j = 0; j < ROW_AMT; j += 1) {
			grid[i][j].display();
		}
	}
}

function mousePressed() {
	var x, y;
	//Calculate which tile was pressed
	x = floor(mouseX * (COL_AMT < ROW_AMT ? ROW_AMT : COL_AMT) / CANVAS_SIZE);
	y = floor(mouseY * (COL_AMT < ROW_AMT ? ROW_AMT : COL_AMT) / CANVAS_SIZE);
	//If the tile pressed is in bounds, toggle its alive boolean
	if (0 <= x && x < COL_AMT && 0 <= y && y < ROW_AMT) {
		grid[x][y].alive = !(grid[x][y].alive);
	}
}
