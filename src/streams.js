import flyd from 'flyd';
import filter from 'flyd/module/filter';
import o from 'ramda/src/o';

const id = (function() {
  var counter = 64;
  return () => {
    counter += 1;
    return String.fromCharCode(counter);
  };
}());

//--------------------------------
// Stream Transformers and Filters
//--------------------------------

const toEdgeCoords = e => ({
  x: e.target.cellIndex,
  y: e.target.parentElement.rowIndex,
  id: id(),
  src: e.target
});

const toGridCoords = e => ({
  x: e.target.cellIndex,
  y: e.target.parentElement.rowIndex,
  src: e.target
});

const isTd = e => e.target.nodeName === 'TD';

const isGrid = n => pt =>  pt.x > 0   && pt.y > 0 && 
                           pt.x < n-1 && pt.y < n-1;

const isCorner = n => pt => 
  (pt.x === 0   && pt.y === 0)   ||
  (pt.x === 0   && pt.y === n-1) ||
  (pt.x === n-1 && pt.y === 0)   ||
  (pt.x === n-1 && pt.y === n-1); 

const isEdge = n => pt => !isGrid(n)(pt) &&! isCorner(n)(pt);

//--------------------------------
// Streams
//--------------------------------

export const clicks = flyd.stream();

export const edge = filter(isEdge(10), flyd.map(toEdgeCoords, filter(isTd, clicks)));

export const grid = filter(isGrid(10), flyd.map(toGridCoords, filter(isTd, clicks))); 

