var Vector2D = require('../../utilities/vector2D');

//
// A basic control that is used by a menu to perform an action callback when
// selected
//
var Control = function(name, label) {

	//basic properties
	this.name = name;
	this.engageCallback = null;

	//control style
	this.showBorder = false;
	this.backgroundImg = null;
	this.backgroundFill = '#333';
	this.borderColor = '#333';
	this.borderWidth = 1;
	this.borderRadius = 5;

	//label
	this.label = label || 'Control Default';
	this.labelFont = 'Helvetica,sans-serif';
	this.labelSize = '24px';
	//this.labelWidth = this.ctx.measureText(this.label).width;
	this.labelPaddingX = 10;

	//dimensions
	this.height = 48;
	this.width  = 100;

	//movement
	this.pos = Vector2D.create(100,100);
	this.vel = Vector2D.create(0,0);
	this.acc = Vector2D.create(0,0);

}

//
//engage the callback for this control
//
Control.prototype.engage = function() {
	if (typeof this.engageCallback === 'function') {
		this.engageCallback();
	}
	else {
		console.error('Unable to engage control function on control: ', this.name);
	}
}

//
// Static draw of this control
//
Control.prototype.draw = function(ctx) {

	ctx.beginPath();

	//draw the background image if exists
	if (this.backgroundImg) {
		ctx.drawImage(this.backgroundImg, this.pos.x, this.pos.y, this.width, this.height);
	}

	ctx.fillStyle = this.backgroundFill;
	ctx.strokeStyle = this.borderColor;
	ctx.font = this.labelSize + " " + this.labelFont;

	//draw the label
	ctx.textBaseline = 'middle';
	ctx.fillText(this.label, this.pos.x + this.labelPaddingX, this.pos.y + this.height/2);

	//strokes a rounded rectangle
	if (this.showBorder) {
			ctx.moveTo(this.pos.x, this.pos.y + this.borderRadius);
			ctx.lineTo(this.pos.x, this.pos.y + this.height - this.borderRadius);
			ctx.quadraticCurveTo(this.pos.x, this.pos.y + this.height, this.pos.x + this.borderRadius, this.pos.y + this.height);
			ctx.lineTo(this.pos.x + this.width - this.borderRadius, this.pos.y + this.height);
			ctx.quadraticCurveTo(this.pos.x + this.width, this.pos.y + this.height, this.pos.x + this.width, this.pos.y + this.height - this.borderRadius);
			ctx.lineTo(this.pos.x + this.width, this.pos.y + this.borderRadius);
			ctx.quadraticCurveTo(this.pos.x + this.width, this.pos.y, this.pos.x + this.width - this.borderRadius, this.pos.y);
			ctx.lineTo(this.pos.x + this.borderRadius, this.pos.y);
			ctx.quadraticCurveTo(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.borderRadius);
			ctx.stroke();
	}
}

//export constructor
module.exports = Control;
