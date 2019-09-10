'use strict';

/* BASE VARIABLES */
let curveCounter = counter();

///!!!!!external
let curves = [];
let selectedCurveNum = -1;


/* DEFAULT OPTIONS */
let defaultCurveFill = 'none';
let defaultCurveStroke = 'dimgrey';
let defaultCurveStrokeWidth = 4;
let defaultCurveStrokeLinecap = 'round';

let defaultGuideLineFill = 'none';
let defaultGuideLineStroke = 'black';
let defaultGuideLineStrokeWidth = 1;
let defaultGuideLineStrokeLinecap = 'round';

let defaultGuidePointFill = 'red';
let defaultGuidePointStroke = 'black';
let defaultGuidePointStrokeWidth = 1;
let defaultGuidePointRadius = 5;


/* SERVICE FUNCTIONS */
function counter() {
  let count = 0;
  return () => count++;
}

function Point(coordX, coordY) {
  return { coordX, coordY };
}

function getLocalCoords(e) {
  let box = bezierCanvas.getBoundingClientRect();
  let localCoordX = Math.round( e.pageX - box.x );
  let localCoordY = Math.round( e.pageY - box.y );
  return new Point(localCoordX, localCoordY);
}

/* CONSTRUCTOR */
function CubicBezierCurve(pointA, pointC1, pointC2, pointB, canvas) {






  // this.visibleGuides = true;

  //!!!!!!!!!!!!!!!!!!!!!!!!
  // newPath.addEventListener('click', selectCurve.bind(newPath));

  //!!!!!!!!!!!!!!!!!!!!!!!!
  // curves.push(newPath);


  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  this.generateCurveHTMLGroup = function() {};
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  this.generateCurveHTML = function() {
    let pathTemplate = document.getElementById('path-template');
    this.html = pathTemplate.cloneNode(false);
    this.num = curveCounter();
    this.id = 'curve_' + this.num;
    this.html.id = this.id;
  };

  this.setCurveDefaultDisplayParams = function() {
    this.fill = defaultCurveFill;
    this.stroke = defaultCurveStroke;
    this.strokeWidth = defaultCurveStrokeWidth;
    this.strokeLinecap = defaultCurveStrokeLinecap;

    this.setCurveDisplayParams();
  };

  this.setCurveDisplayParams = function() {
    this.html.setAttribute('fill',           this.fill);
    this.html.setAttribute('stroke',         this.stroke);
    this.html.setAttribute('stroke-width',   this.strokeWidth);
    this.html.setAttribute('stroke-linecap', this.strokeLinecap);
  };

  this.setPointsAndUpdate = function(pointA, pointC1, pointC2, pointB) {
    this.setPoints(pointA, pointC1, pointC2, pointB);
    this.updatePath();
    this.updateGuidesPosition();
  };

  this.setPoints = function(pointA, pointC1, pointC2, pointB) {
    this.pointA  = pointA;
    this.pointC1 = pointC1;
    this.pointC2 = pointC2;
    this.pointB  = pointB;
  };

  this.updatePath = function() {
    let path = `M ${this.pointA.coordX},   ${this.pointA.coordY} 
                C ${this.pointC1.coordX},  ${this.pointC1.coordY}, 
                  ${this.pointC2.coordX},  ${this.pointC2.coordY}, 
                  ${this.pointB.coordX},   ${this.pointB.coordY}`;
    this.html.setAttribute('d', path);
  };

  this.appendCurveHTMLTo = function(parent) {
    parent.appendChild(this.html)
  };

  this.generateGuidesHTML = function() {
      let lineTemplate = document.getElementById('line-template');
      let circTemplate = document.getElementById('circle-template');

      let guideLineAC1 = lineTemplate.cloneNode(false);
      let guideLineBC2 = lineTemplate.cloneNode(false);
      let guidePointA  = circTemplate.cloneNode(false);
      let guidePointC1 = circTemplate.cloneNode(false);
      let guidePointB  = circTemplate.cloneNode(false);
      let guidePointC2 = circTemplate.cloneNode(false);

      guideLineAC1.id = 'guideAC1_' + this.num;
      guideLineBC2.id = 'guideBC2_' + this.num;
      guidePointA.id  = 'guidePointA_' + this.num;
      guidePointC1.id = 'guidePointC1_' + this.num;
      guidePointC2.id = 'guidePointC2_' + this.num;
      guidePointB.id  = 'guidePointB_' + this.num;


      // guidePointA.addEventListener( 'click',  this.movePointA);
      // guidePointC1.addEventListener('click',  this.movePointC1);
      // guidePointC2.addEventListener('click',  this.movePointC2);
      // guidePointB.addEventListener( 'click',  this.movePointB);

      this.guides = {
        guideLineAC1,
        guideLineBC2,
        guidePointA,
        guidePointC1,
        guidePointC2,
        guidePointB
      };
  };

  this.setGuidesDefaultDisplayParams = function() {
    this.guideLineFill = defaultGuideLineFill;
    this.guideLineStroke = defaultGuideLineStroke;
    this.guideLineStrokeWidth = defaultGuideLineStrokeWidth;
    this.guideLineStrokeLinecap = defaultGuideLineStrokeLinecap;

    this.guidePointFill = defaultGuidePointFill;
    this.guidePointStroke = defaultGuidePointStroke;
    this.guidePointStrokeWidth = defaultGuidePointStrokeWidth;
    this.guidePointRadius = defaultGuidePointRadius;

    this.setGuidesDisplayParams();
  }

  this.setGuidesDisplayParams = function() {
    this.guides.guideLineAC1.setAttribute('fill', this.guideLineFill);
    this.guides.guideLineAC1.setAttribute('stroke', this.guideLineStroke);
    this.guides.guideLineAC1.setAttribute('stroke-width', this.guideLineStrokeWidth);
    this.guides.guideLineAC1.setAttribute('stroke-linecap', this.guideLineStrokeLinecap);
    
    this.guides.guideLineBC2.setAttribute('fill', this.guideLineFill);
    this.guides.guideLineBC2.setAttribute('stroke', this.guideLineStroke);
    this.guides.guideLineBC2.setAttribute('stroke-width', this.guideLineStrokeWidth);
    this.guides.guideLineBC2.setAttribute('stroke-linecap', this.guideLineStrokeLinecap);
    
    this.guides.guidePointA.setAttribute('fill', this.guidePointFill);
    this.guides.guidePointA.setAttribute('stroke', this.guidePointStroke);
    this.guides.guidePointA.setAttribute('stroke-width', this.guidePointStrokeWidth);
    this.guides.guidePointA.setAttribute('r', this.guidePointRadius);
    
    this.guides.guidePointC1.setAttribute('fill', this.guidePointFill);
    this.guides.guidePointC1.setAttribute('stroke', this.guidePointStroke);
    this.guides.guidePointC1.setAttribute('stroke-width', this.guidePointStrokeWidth);
    this.guides.guidePointC1.setAttribute('r', this.guidePointRadius);
    
    this.guides.guidePointC2.setAttribute('fill', this.guidePointFill);
    this.guides.guidePointC2.setAttribute('stroke', this.guidePointStroke);
    this.guides.guidePointC2.setAttribute('stroke-width', this.guidePointStrokeWidth);
    this.guides.guidePointC2.setAttribute('r', this.guidePointRadius);
    
    this.guides.guidePointB.setAttribute('fill', this.guidePointFill);
    this.guides.guidePointB.setAttribute('stroke', this.guidePointStroke);
    this.guides.guidePointB.setAttribute('stroke-width', this.guidePointStrokeWidth);
    this.guides.guidePointB.setAttribute('r', this.guidePointRadius);
  };

  this.updateGuidesPosition = function() {
    this.guides.guideLineAC1.setAttribute('x1', this.pointA.coordX);
    this.guides.guideLineAC1.setAttribute('y1', this.pointA.coordY);
    this.guides.guideLineAC1.setAttribute('x2', this.pointC1.coordX);
    this.guides.guideLineAC1.setAttribute('y2', this.pointC1.coordY);
    
    this.guides.guideLineBC2.setAttribute('x1', this.pointB.coordX);
    this.guides.guideLineBC2.setAttribute('y1', this.pointB.coordY);
    this.guides.guideLineBC2.setAttribute('x2', this.pointC2.coordX);
    this.guides.guideLineBC2.setAttribute('y2', this.pointC2.coordY);
    
    this.guides.guidePointA.setAttribute('cx', this.pointA.coordX);
    this.guides.guidePointA.setAttribute('cy', this.pointA.coordY);
    
    this.guides.guidePointC1.setAttribute('cx', this.pointC1.coordX);
    this.guides.guidePointC1.setAttribute('cy', this.pointC1.coordY);
    
    this.guides.guidePointC2.setAttribute('cx', this.pointC2.coordX);
    this.guides.guidePointC2.setAttribute('cy', this.pointC2.coordY);
    
    this.guides.guidePointB.setAttribute('cx', this.pointB.coordX);
    this.guides.guidePointB.setAttribute('cy', this.pointB.coordY);
  };

  this.appendGuidesHTMLTo = function(parent) {
    parent.appendChild( this.guides.guideLineAC1 );
    parent.appendChild( this.guides.guideLineBC2 );
    parent.appendChild( this.guides.guidePointA );
    parent.appendChild( this.guides.guidePointC1 );
    parent.appendChild( this.guides.guidePointC2 );
    parent.appendChild( this.guides.guidePointB );
  };

  this.setPointListeners = function() {
    this.setPointMoveListener(this.guides.guidePointA,  this.setAndUpdatePointA.bind(this));
    this.setPointMoveListener(this.guides.guidePointC1, this.setAndUpdatePointC1.bind(this));
    this.setPointMoveListener(this.guides.guidePointC2, this.setAndUpdatePointC2.bind(this));
    this.setPointMoveListener(this.guides.guidePointB,  this.setAndUpdatePointB.bind(this));
  };    

  this.setPointMoveListener = function(element, callback) {
     element.onmousedown = function(e) {
      e.stopPropagation();
      e.preventDefault();

      console.log('setPointMoveListener');
      document.onmousemove = function(e) {
        e.stopPropagation();
        let point = getLocalCoords(e);
        callback(point);
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  this.setAndUpdatePointA = function(pointA) {
    this.pointA = pointA;
    this.updatePath();
    this.updateGuidesPosition();
  };

  this.setAndUpdatePointC1 = function(pointC1) {
    this.pointC1 = pointC1;
    this.updatePath();
    this.updateGuidesPosition();
  };

  this.setAndUpdatePointC2 = function(pointC2) {
    this.pointC2 = pointC2;
    this.updatePath();
    this.updateGuidesPosition();
  };

  this.setAndUpdatePointB = function(pointB) {
    this.pointB = pointB;
    this.updatePath();
    this.updateGuidesPosition();
  };


////////////////////
  this.showGuides = function() {};
  this.hideGuides = function() {};

  this.updateParameters = function() {
    this.updatePath();
    this.setCurveDisplayParams();
    this.updateGuidesPosition();
    this.setGuidesDisplayParams();
  };
////////////////////////

  this.generateCurveHTML();
  this.setCurveDefaultDisplayParams();
  this.setPoints(pointA, pointC1, pointC2, pointB);
  this.appendCurveHTMLTo(canvas);
  this.updatePath();

  this.generateGuidesHTML();
  this.setGuidesDefaultDisplayParams();
  this.updateGuidesPosition();
  this.appendGuidesHTMLTo(canvas);


}
