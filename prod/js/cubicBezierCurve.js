'use strict';

/* BASE VARIABLES & DEFAULT OPTIONS*/
let options = {
  defaultCurveFill:              'none',
  defaultCurveStroke:            'dimgrey',
  defaultCurveStrokeWidth:        4,
  defaultCurveStrokeLinecap:     'round',

  defaultGuideLineFill:          'none',
  defaultGuideLineStroke:        'black',
  defaultGuideLineStrokeWidth:    1,
  defaultGuideLineStrokeLinecap: 'round',

  defaultGuidePointFill:         'red',
  defaultGuidePointStroke:       'black',
  defaultGuidePointStrokeWidth:   1,
  defaultGuidePointRadius:        5
};

let curveCounter = counter();

/* SERVICE FUNCTIONS */
function counter() {
  let count = 0;
  return () => count++;
}

function Point(coordX, coordY) {
  return { coordX, coordY };
}

function getLocalCoordsRegardingTo(parent, e) {
  let box = parent.getBoundingClientRect();
  let localCoordX = Math.round( e.pageX - box.x );
  let localCoordY = Math.round( e.pageY - box.y );
  return new Point(localCoordX, localCoordY);
}

let getLocalCoords = getLocalCoordsRegardingTo.bind(null, bezierCanvas);

/* CONSTRUCTOR */
function CubicBezierCurve(pointA, pointC1, pointC2, pointB, canvas) {

  this._createNewCurve = function() {
    this._generateHTML();
    this._setDefaultDisplayParams();
    this.setPointsAndUpdate(pointA, pointC1, pointC2, pointB);
    this._appendHTMLTo(canvas);
  };

  this._generateHTML = function() {
    let num = curveCounter();
    this._generateCurveHTML(num);
    this._generateGuidesHTML(num);
  };

    this._generateCurveHTML = function(num) {
      let pathTemplate = document.getElementById('path-template');
      this.html = pathTemplate.cloneNode(false);
      this.id = 'curve_' + num;
      this.html.id = this.id;
    };

    this._generateGuidesHTML = function(num) {
        let lineTemplate = document.getElementById('line-template');
        let circTemplate = document.getElementById('circle-template');

        let guideLineAC1 = lineTemplate.cloneNode(false);
        let guideLineBC2 = lineTemplate.cloneNode(false);
        let guidePointA  = circTemplate.cloneNode(false);
        let guidePointC1 = circTemplate.cloneNode(false);
        let guidePointB  = circTemplate.cloneNode(false);
        let guidePointC2 = circTemplate.cloneNode(false);

        guideLineAC1.id = 'guideAC1_'     + num;
        guideLineBC2.id = 'guideBC2_'     + num;
        guidePointA.id  = 'guidePointA_'  + num;
        guidePointC1.id = 'guidePointC1_' + num;
        guidePointC2.id = 'guidePointC2_' + num;
        guidePointB.id  = 'guidePointB_'  + num;

        this.guides = {
          guideLineAC1,
          guideLineBC2,
          guidePointA,
          guidePointC1,
          guidePointC2,
          guidePointB
        };
    };


  this._setDefaultDisplayParams = function() {
    this._setCurveDefaultDisplayParams();
    this._setGuidesDefaultDisplayParams();
  };

    this._setCurveDefaultDisplayParams = function() {
      this._fill          = options.defaultCurveFill;
      this._stroke        = options.defaultCurveStroke;
      this._strokeWidth   = options.defaultCurveStrokeWidth;
      this._strokeLinecap = options.defaultCurveStrokeLinecap;

      this._setCurveDisplayParams();
    };

    this._setCurveDisplayParams = function() {
      this.html.setAttribute('fill',           this._fill);
      this.html.setAttribute('stroke',         this._stroke);
      this.html.setAttribute('stroke-width',   this._strokeWidth);
      this.html.setAttribute('stroke-linecap', this._strokeLinecap);
    };

    this._setGuidesDefaultDisplayParams = function() {
      this._guideLineFill          = options.defaultGuideLineFill;
      this._guideLineStroke        = options.defaultGuideLineStroke;
      this._guideLineStrokeWidth   = options.defaultGuideLineStrokeWidth;
      this._guideLineStrokeLinecap = options.defaultGuideLineStrokeLinecap;

      this._guidePointFill         = options.defaultGuidePointFill;
      this._guidePointStroke       = options.defaultGuidePointStroke;
      this._guidePointStrokeWidth  = options.defaultGuidePointStrokeWidth;
      this._guidePointRadius       = options.defaultGuidePointRadius;

      this._setGuidesDisplayParams();
    }

    this._setGuidesDisplayParams = function() {
      this.guides.guideLineAC1.setAttribute('fill', this._guideLineFill);
      this.guides.guideLineAC1.setAttribute('stroke', this._guideLineStroke);
      this.guides.guideLineAC1.setAttribute('stroke-width', this._guideLineStrokeWidth);
      this.guides.guideLineAC1.setAttribute('stroke-linecap', this._guideLineStrokeLinecap);
      
      this.guides.guideLineBC2.setAttribute('fill', this._guideLineFill);
      this.guides.guideLineBC2.setAttribute('stroke', this._guideLineStroke);
      this.guides.guideLineBC2.setAttribute('stroke-width', this._guideLineStrokeWidth);
      this.guides.guideLineBC2.setAttribute('stroke-linecap', this._guideLineStrokeLinecap);
      
      this.guides.guidePointA.setAttribute('fill', this._guidePointFill);
      this.guides.guidePointA.setAttribute('stroke', this._guidePointStroke);
      this.guides.guidePointA.setAttribute('stroke-width', this._guidePointStrokeWidth);
      this.guides.guidePointA.setAttribute('r', this._guidePointRadius);
      
      this.guides.guidePointC1.setAttribute('fill', this._guidePointFill);
      this.guides.guidePointC1.setAttribute('stroke', this._guidePointStroke);
      this.guides.guidePointC1.setAttribute('stroke-width', this._guidePointStrokeWidth);
      this.guides.guidePointC1.setAttribute('r', this._guidePointRadius);
      
      this.guides.guidePointC2.setAttribute('fill', this._guidePointFill);
      this.guides.guidePointC2.setAttribute('stroke', this._guidePointStroke);
      this.guides.guidePointC2.setAttribute('stroke-width', this._guidePointStrokeWidth);
      this.guides.guidePointC2.setAttribute('r', this._guidePointRadius);
      
      this.guides.guidePointB.setAttribute('fill', this._guidePointFill);
      this.guides.guidePointB.setAttribute('stroke', this._guidePointStroke);
      this.guides.guidePointB.setAttribute('stroke-width', this._guidePointStrokeWidth);
      this.guides.guidePointB.setAttribute('r', this._guidePointRadius);
    };


  this.setPointsAndUpdate = function(pointA, pointC1, pointC2, pointB) {
    this._setPoints(pointA, pointC1, pointC2, pointB);
    this._updatePath();
    this._updateGuidesPosition();
  };

    this._setPoints = function(pointA, pointC1, pointC2, pointB) {
      if (pointA)  this._pointA  = pointA;
      if (pointC1) this._pointC1 = pointC1;
      if (pointC2) this._pointC2 = pointC2;
      if (pointB)  this._pointB  = pointB;
    };

    this._updatePath = function() {
      let path = `M ${this._pointA.coordX},   ${this._pointA.coordY} 
                  C ${this._pointC1.coordX},  ${this._pointC1.coordY}, 
                    ${this._pointC2.coordX},  ${this._pointC2.coordY}, 
                    ${this._pointB.coordX},   ${this._pointB.coordY}`;
      this.html.setAttribute('d', path);
    };

    this._updateGuidesPosition = function() {
      this.guides.guideLineAC1.setAttribute('x1', this._pointA.coordX);
      this.guides.guideLineAC1.setAttribute('y1', this._pointA.coordY);
      this.guides.guideLineAC1.setAttribute('x2', this._pointC1.coordX);
      this.guides.guideLineAC1.setAttribute('y2', this._pointC1.coordY);
      
      this.guides.guideLineBC2.setAttribute('x1', this._pointB.coordX);
      this.guides.guideLineBC2.setAttribute('y1', this._pointB.coordY);
      this.guides.guideLineBC2.setAttribute('x2', this._pointC2.coordX);
      this.guides.guideLineBC2.setAttribute('y2', this._pointC2.coordY);
      
      this.guides.guidePointA.setAttribute('cx', this._pointA.coordX);
      this.guides.guidePointA.setAttribute('cy', this._pointA.coordY);
      
      this.guides.guidePointC1.setAttribute('cx', this._pointC1.coordX);
      this.guides.guidePointC1.setAttribute('cy', this._pointC1.coordY);
      
      this.guides.guidePointC2.setAttribute('cx', this._pointC2.coordX);
      this.guides.guidePointC2.setAttribute('cy', this._pointC2.coordY);
      
      this.guides.guidePointB.setAttribute('cx', this._pointB.coordX);
      this.guides.guidePointB.setAttribute('cy', this._pointB.coordY);
    };


  this._appendHTMLTo = function(parent) {
    this._appendCurveHTMLTo(parent);
    this._appendGuidesHTMLTo(parent);
  };

    this._appendCurveHTMLTo = function(parent) {
      parent.appendChild(this.html)
    };

    this._appendGuidesHTMLTo = function(parent) {
      parent.appendChild( this.guides.guideLineAC1 );
      parent.appendChild( this.guides.guideLineBC2 );
      parent.appendChild( this.guides.guidePointA );
      parent.appendChild( this.guides.guidePointC1 );
      parent.appendChild( this.guides.guidePointB );
      parent.appendChild( this.guides.guidePointC2 );
    };


  this.setMoveListeners = function() {
    this._setCurveMoveListener(this.html, this.move.bind(this));
    this._setPointsListeners();
  };

    this._setCurveMoveListener = function(element, moveCallback) {
      element.onmousedown = function(e) {
        e.stopPropagation();
        e.preventDefault();
        let startPosition = getLocalCoords(e);

        document.onmousemove = function(e) {
          let nextPosition = getLocalCoords(e);
          let deltaX = nextPosition.coordX - startPosition.coordX;
          let deltaY = nextPosition.coordY - startPosition.coordY;
          startPosition = nextPosition;
          moveCallback(deltaX, deltaY);
        };

        document.onmouseup = function(e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }

    this.move = function(deltaX, deltaY) {
      let newPointA  = new Point(deltaX + this._pointA.coordX,  deltaY + this._pointA.coordY);
      let newPointC1 = new Point(deltaX + this._pointC1.coordX, deltaY + this._pointC1.coordY);
      let newPointC2 = new Point(deltaX + this._pointC2.coordX, deltaY + this._pointC2.coordY);
      let newPointB  = new Point(deltaX + this._pointB.coordX,  deltaY + this._pointB.coordY);

      this.setPointsAndUpdate(newPointA, newPointC1, newPointC2, newPointB);
    };

    this._setPointsListeners = function() {
      this._setPointMoveListener(this.guides.guidePointA,  this.setAndUpdatePointA.bind(this));
      this._setPointMoveListener(this.guides.guidePointC1, this.setAndUpdatePointC1.bind(this));
      this._setPointMoveListener(this.guides.guidePointC2, this.setAndUpdatePointC2.bind(this));
      this._setPointMoveListener(this.guides.guidePointB,  this.setAndUpdatePointB.bind(this));
    };    

    this._setPointMoveListener = function(element, callback) {
      element.onmousedown = function(e) {
        e.stopPropagation();
        e.preventDefault();

        document.onmousemove = function(e) {
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
      this.setPointsAndUpdate(pointA, null, null, null);
    };

    this.setAndUpdatePointC1 = function(pointC1) {
      this.setPointsAndUpdate(null, pointC1, null, null);
    };

    this.setAndUpdatePointC2 = function(pointC2) {
      this.setPointsAndUpdate(null, null, pointC2, null);
    };

    this.setAndUpdatePointB = function(pointB) {
      this.setPointsAndUpdate(null, null, null, pointB);
    };

  this.setSelectListener = function(callback) {
    this.html.addEventListener('mousedown', callback);
  };


  this.showGuides = function() {
    for (let key in this.guides) {
      this.guides[key].setAttribute('visibility', 'visible');
    }
  };

  this.hideGuides = function() {
    for (let key in this.guides) {
      this.guides[key].setAttribute('visibility', 'hidden');
    }
  };


  this.setColorAndUpate = function(color) {
    this._stroke = color;
    this.html.setAttribute('stroke', this._stroke);
  }


  this.delete = function() {
    document.getElementById(this.id).remove();
    document.getElementById(this.guides.guideLineAC1.id).remove();
    document.getElementById(this.guides.guideLineBC2.id).remove();
    document.getElementById(this.guides.guidePointA.id).remove();
    document.getElementById(this.guides.guidePointC1.id).remove();
    document.getElementById(this.guides.guidePointC2.id).remove();
    document.getElementById(this.guides.guidePointB.id).remove();
  };


  /* GENERATE NEW CURVE */
  this._createNewCurve();
}