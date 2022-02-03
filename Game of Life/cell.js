/*Class definition of Cell*/

/*eslint no-console: off*/
/*eslint-env browser*/
/*jslint node: true */
/*global stroke*/
/*global noFill*/
/*global rect*/
/*global strokeWeight*/
/*global fill*/
"use strict";

function Cell(xPos, yPos, size) {
	this.x = xPos;
	this.y = yPos;
	this.alive = false;
	this.size = size;
}

Cell.prototype.display = function () {
	stroke(0);
	strokeWeight(1);
	if(this.alive) {
		fill(0);
	} else {
		noFill();
	}
	rect(this.x, this.y, this.size, this.size);
};