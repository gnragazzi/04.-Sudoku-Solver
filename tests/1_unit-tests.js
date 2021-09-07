const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

const imposibleString = '1.5..2.84..63.12.7.2..5.....9..1....81111674.3.7.2..9.477777..1..16....926914.37.'
const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
const stringWithInvalidLength = '5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const stringWithInvalidCharacters = 'r.@..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'


suite('UnitTests', () => {
    test('Logic handles a valid puzzle string of 81 characters',()=>{
        assert.propertyVal(solver.validate(validString),'valid', true)
    }),
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',()=>{
        assert.propertyVal(solver.validate(stringWithInvalidCharacters),'valid', false)
    }),
    test('Logic handles a puzzle string that is not 81 characters in length',()=>{
        assert.propertyVal(solver.validate(stringWithInvalidLength),'valid', false)
    })
    test('Logic handles a valid row placement',()=>{
        assert.isTrue(solver.checkRowPlacement(validString,0,'2',3))
    })
    test('Logic handles an invalid row placement',()=>{
        assert.isFalse(solver.checkRowPlacement(validString,0,'2',2))
    })
    test('Logic handles a valid column placement',()=>{
        assert.isTrue(solver.checkColPlacement(validString,0,'2',3))
    })
    test('Logic handles an invalid column placement',()=>{
        assert.isFalse(solver.checkColPlacement(validString,0,'2',9))
    })
    test('Logic handles a valid region (3x3 grid) placement',()=>{
        assert.isTrue(solver.checkRegionPlacement(validString,0,'2',3))
    })
    test('Logic handles an invalid region (3x3 grid) placement',()=>{
        assert.isFalse(solver.checkRegionPlacement(validString,0,'2',6))
    })
    test('Valid puzzle strings pass the solver',()=>{
        assert.isString(solver.solve(validString))
    })
    test('Invalid puzzle strings fail the solver',()=>{
        assert.isFalse(solver.solve(imposibleString))
    })
    test('Solver returns the expected solution for an incomplete puzzle',()=>{
        assert.equal(solver.solve(validString),validSolution)
    })
});
