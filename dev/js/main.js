'use strict';

bezier();

function bezier(svgCanvasId = 'bezierCanvas',
                clearBtnId  = 'clear-btn', 
                addBtnId    = 'add-curve-btn', 
                delBtnId    = 'del-curve-btn', 
                colorBtnId  = 'change-color-btn') {

  /* BASE VARIABLES AND DEFENITIONS */
  let bezierCanvas;
  let clearButton;
  let addButton;
  let delButton;
  let colorButton;

  try {
    let errorStingBegin = 'function "bezier" error. Uncorrect input data: ';
    let errorStingEnd   = ' is not defined';

    bezierCanvas = document.getElementById(svgCanvasId);
    if (!bezierCanvas) {
      throw new Error(errorStingBegin + 'svgCanvasId' + errorStingEnd);
    }

    clearButton = document.getElementById(clearBtnId);
    if (!clearButton) {
      throw new Error(errorStingBegin + 'clearBtnId' + errorStingEnd);
    }

    addButton = document.getElementById(addBtnId);
    if (!addButton) {
      throw new Error(errorStingBegin + 'addBtnId' + errorStingEnd);
    }

    delButton = document.getElementById(delBtnId);
    if (!delButton) {
      throw new Error(errorStingBegin + 'delBtnId' + errorStingEnd);
    }

    colorButton = document.getElementById(colorBtnId);
    if (!colorButton) {
      throw new Error(errorStingBegin + 'colorBtnId' + errorStingEnd);
    }
  } catch (error) {
    console.log(error.message);
    return;
  }

  clearButton.addEventListener( 'click', clearBezierCanvas);
  addButton.addEventListener(   'click', addNewCurve);
  delButton.addEventListener(   'click', deleteSelectedCurve);
  colorButton.addEventListener( 'click', changeCurveColor);
  bezierCanvas.addEventListener('click', unselectCurves);

  function getLocalCoords(e) {
    let box = bezierCanvas.getBoundingClientRect();
    let localCoordX = Math.round( e.pageX - box.x );
    let localCoordY = Math.round( e.pageY - box.y );
    return new Point(localCoordX, localCoordY);
  }



  /* DEFAULT SETTINGS */
  // let defaultCurveFill = 'none';
  // let defaultCurveStroke = 'blue';
  // let defaultCurveStrokeWidth = 4;
  // let defaultCurveStrokeLinecap = 'round';

  // let defaultGuideLineFill = 'none';
  // let defaultGuideLineStroke = 'black';
  // let defaultGuideLineStrokeWidth = 1;
  // let defaultGuideLineStrokeLinecap = 'round';

  // let defaultGuidePointFill = 'red';
  // let defaultGuidePointStroke = 'black';
  // let defaultGuidePointStrokeWidth = 1;
  

  /* GUIDES */
  // let guideAC1;    
  // let guideBC2;
  // let guidePointA;
  // let guidePointC1;
  // let guidePointB;
  // let guidePointC2;

  // generateGuides();

  // function generateGuides() {
  //   let lineTemplate = document.getElementById('line-template');
  //   let circTemplate = document.getElementById('circle-template');

  //   guideAC1     = lineTemplate.cloneNode(false);
  //   guideBC2     = lineTemplate.cloneNode(false);
  //   guidePointA  = circTemplate.cloneNode(false);
  //   guidePointC1 = circTemplate.cloneNode(false);
  //   guidePointB  = circTemplate.cloneNode(false);
  //   guidePointC2 = circTemplate.cloneNode(false);

  //   guideAC1.id     = 'guideAC1';
  //   guideBC2.id     = 'guideBC2';
  //   guidePointA.id  = 'guidePointA';
  //   guidePointC1.id = 'guidePointC1';
  //   guidePointB.id  = 'guidePointB';
  //   guidePointC2.id = 'guidePointC2';

  //   bezierCanvas.appendChild(guideAC1);
  //   bezierCanvas.appendChild(guideBC2);
  //   bezierCanvas.appendChild(guidePointA);
  //   bezierCanvas.appendChild(guidePointC1);
  //   bezierCanvas.appendChild(guidePointB);
  //   bezierCanvas.appendChild(guidePointC2);
  // }

  // function setGides(pointA, pointC1, pointC2, pointB) {
  //   guideAC1.setAttribute('x1', pointA.coordX);
  //   guideAC1.setAttribute('y1', pointA.coordY);
  //   guideAC1.setAttribute('x2', pointC1.coordX);
  //   guideAC1.setAttribute('y2', pointC1.coordY);

  //   guideBC2.setAttribute('x1', pointB.coordX);
  //   guideBC2.setAttribute('y1', pointB.coordY);
  //   guideBC2.setAttribute('x2', pointC2.coordX);
  //   guideBC2.setAttribute('y2', pointC2.coordY);

  //   guidePointA.setAttribute('cx', pointA.coordX);
  //   guidePointA.setAttribute('cy', pointA.coordY);

  //   guidePointC1.setAttribute('cx', pointC1.coordX);
  //   guidePointC1.setAttribute('cy', pointC1.coordY);

  //   guidePointB.setAttribute('cx', pointB.coordX);
  //   guidePointB.setAttribute('cy', pointB.coordY);

  //   guidePointC2.setAttribute('cx', pointC2.coordX);
  //   guidePointC2.setAttribute('cy', pointC2.coordY);
  // }

  // function hideGides() {
  //   guideAC1.setAttribute('x1', -100);
  //   guideAC1.setAttribute('y1', -100);
  //   guideAC1.setAttribute('x2', -100);
  //   guideAC1.setAttribute('y2', -100);

  //   guideBC2.setAttribute('x1', -100);
  //   guideBC2.setAttribute('y1', -100);
  //   guideBC2.setAttribute('x2', -100);
  //   guideBC2.setAttribute('y2', -100);

  //   guidePointA.setAttribute('cx', -100);
  //   guidePointA.setAttribute('cy', -100);

  //   guidePointC1.setAttribute('cx', -100);
  //   guidePointC1.setAttribute('cy', -100);

  //   guidePointB.setAttribute('cx', -100);
  //   guidePointB.setAttribute('cy', -100);

  //   guidePointC2.setAttribute('cx', -100);
  //   guidePointC2.setAttribute('cy', -100);
  // }


  /* FUNCTIONS */

  function clearBezierCanvas(e) {
    // for(let curve of curves) {
    //   document.getElementById(curve.id).remove();
    // }
    // hideGides();
    // curves = [];
  }

  // function setNewCurve(pointA, pointC1, pointC2, pointB) {
  //   let pathTemplate = document.getElementById('path-template');
  //   let newPath = pathTemplate.cloneNode(false);
    
  //   let pathCode = `M ${pointA.coordX},  ${pointA.coordY} 
  //                   C ${pointC1.coordX}, ${pointC1.coordY}, 
  //                   ${pointC2.coordX},   ${pointC2.coordY}, 
  //                   ${pointB.coordX},    ${pointB.coordY}`;

  //   newPath.setAttribute('d', pathCode);
  //   newPath.id = 'curve_' + curves.length;
  //   newPath.setAttribute('stroke', defaultCurveColor);
  //   newPath.addEventListener('click', selectCurve.bind(newPath));

  //   bezierCanvas.appendChild(newPath);
  //   curves.push(newPath);

  //   return curves.length - 1;
  // }

  function updateCurve(curve_num, pointA, pointC1, pointC2, pointB) {
    let curve = curves[curve_num];

    let pathCode = `M ${pointA.coordX},  ${pointA.coordY} 
                    C ${pointC1.coordX}, ${pointC1.coordY}, 
                    ${pointC2.coordX},   ${pointC2.coordY}, 
                    ${pointB.coordX},    ${pointB.coordY}`;

    curve.setAttribute('d', pathCode);
  }



  // function addNewCurve(e) {
  //   let pointA;
  //   let pointB;
  //   let pointC1;
  //   let pointC2;
  //   let newCurveNum;

  //   getPoints();

  //   function getPoints() {

  //     getBeginPoints();

  //     function getBeginPoints() {
  //       bezierCanvas.onmousedown = function(e) {
  //         e.stopPropagation();
  //         e.preventDefault();
  //         pointA = getLocalCoords(e);
  //         pointC1 = pointA;
  //         // newCurveNum = setNewCurve(pointA, pointA, pointA, pointA);
  //         newCurve = new CubicBezierCurve(pointA, pointA, pointA, pointA);
  //         setGides(pointA, pointA, pointA, pointA);
  //         selectedCurveNum = newCurveNum;

  //         document.onmousemove = function(e) {
  //           e.stopPropagation();
  //           pointC1 = getLocalCoords(e);
  //           updateCurve(newCurveNum, pointA, pointC1, pointC1, pointC1);
  //           setGides(pointA, pointC1, pointC1, pointC1);
  //         }

  //         document.onmouseup = function(e) {
  //           document.onmousemove = function(e) {
  //             e.stopPropagation();
  //             pointB = getLocalCoords(e);
  //             updateCurve(newCurveNum, pointA, pointC1, pointB, pointB);
  //             setGides(pointA, pointC1, pointB, pointB);
  //           }
  //           document.onmouseup = null;
  //           bezierCanvas.onmousedown = null;
  //           getEndPoints();
  //         }
  //       }
  //     }

  //     function getEndPoints() {
  //       bezierCanvas.onmousedown = function(e) {
  //         e.stopPropagation();
  //         e.preventDefault();
  //         pointB = getLocalCoords(e);
  //         pointC2 = pointB;
  //         updateCurve(newCurveNum, pointA, pointC1, pointB, pointB);
  //         setGides(pointA, pointC1, pointB, pointB);

  //         document.onmousemove = function(e) {
  //           e.stopPropagation();
  //           pointC2 = getLocalCoords(e);
  //           updateCurve(newCurveNum, pointA, pointC1, pointC2, pointB);
  //           setGides(pointA, pointC1, pointC2, pointB);
  //         }

  //         document.onmouseup = function(e) {
  //           e.stopPropagation();
  //           setGides(pointA, pointC1, pointC2, pointB);
  //           document.onmousemove = null;
  //           document.onmouseup = null;
  //           bezierCanvas.onmousedown = null;
  //           curves.push(newCurve);
  //         }
  //       }
  //     }
  //   }
  // }

  function selectCurve(e) {
    e.preventDefault();
    e.stopPropagation();

    let num = curves.findIndex( item => item.id == this.id );

    selectedCurveNum = num;
    console.log('selectCurve ' + selectedCurveNum);
  }

  function unselectCurves(e) {
    e.preventDefault();
    // hideGides();
    // selectedCurveNum = -1;
  }

  function deleteSelectedCurve(e) {
    if (selectedCurveNum == -1) return;
    console.log('deleteSelectedCurve ' + selectedCurveNum)
    let curveId = curves[selectedCurveNum].id;
    document.getElementById(curveId).remove();
    curves.splice(selectedCurveNum, 1);
    hideGides();
  }

  function changeCurveColor(e) {
    console.log('changeCurveColor');
    // curves.splice(selectedCurveNum, 1);
  }









//////////////////////

  function addNewCurve(e) {
    let pointA;
    let pointB;
    let pointC1;
    let pointC2;
    // let newCurveNum;
    let newCurve;

    getPoints();

    function getPoints() {

      getBeginPoints();

      function getBeginPoints() {
        bezierCanvas.onmousedown = function(e) {
          e.stopPropagation();
          e.preventDefault();
          pointA = getLocalCoords(e);
          pointC1 = pointA;
          newCurve = new CubicBezierCurve(pointA, pointA, pointA, pointA, bezierCanvas);

          document.onmousemove = function(e) {
            e.stopPropagation();
            pointC1 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC1, pointC1);
          }

          document.onmouseup = function(e) {
            document.onmousemove = function(e) {
              e.stopPropagation();
              pointB = getLocalCoords(e);
              newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);
            }
            document.onmouseup = null;
            bezierCanvas.onmousedown = null;
            getEndPoints();
          }
        }
      }

      function getEndPoints() {
        bezierCanvas.onmousedown = function(e) {
          e.stopPropagation();
          e.preventDefault();
          pointB = getLocalCoords(e);
          pointC2 = pointB;
          newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);

          document.onmousemove = function(e) {
            e.stopPropagation();
            pointC2 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC2, pointB);
          }

          document.onmouseup = function(e) {
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
            bezierCanvas.onmousedown = null;
            curves.push(newCurve);
          }
        }
      }
    }
  }


}