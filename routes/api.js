'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle,coordinate,value} = req.body
      if (!puzzle || !coordinate || (!value && value != 0)) return res.json({ error: 'Required field(s) missing' })
      const validCheck = solver.validate(puzzle)
      if(!validCheck.valid) return res.json({error: validCheck.error})
      // check valid coordinate
      const columnNumber = coordinate.slice(1)
      if(!coordinate[0].match(/[a|b|c|d|e|f|g|h|i]/i) || columnNumber.match(/[^\d0]|0/) || columnNumber.length !== 1){
        return res.json({error: 'Invalid coordinate'})
      }
      // Check valid value
      if(value < 1 || value > 9) return res.json({error: 'Invalid value'})
      const conflict = []
      const row = solver.getNumberedRow(coordinate[0])
      const rowValid = solver.checkRowPlacement(puzzle,row,columnNumber,value)
      if(!rowValid) conflict.push('row')
      const columnValid = solver.checkColPlacement(puzzle,row,columnNumber,value)
      if(!columnValid) conflict.push('column')
      const regValid = solver.checkRegionPlacement(puzzle,row,columnNumber,value)
      if(!regValid) conflict.push('region')
      if(conflict.length === 0) return res.json({'valid':true})
      return res.json({valid: false, conflict})
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body
      if(!puzzle) return res.json({ error: 'Required field missing' })
      const validCheck = solver.validate(puzzle)
      if(!validCheck.valid) return res.json({error: validCheck.error})
      const solution = solver.solve(puzzle)
      if(!solution) return res.json({error:'Puzzle cannot be solved'})
      res.json({solution})
    });
};
