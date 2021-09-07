const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
const stringWithInvalidLength = '5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const stringWithInvalidCharacters = 'r.@..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const imposibleString = '1.5..2.84..63.12.7.2..5.....9..1....81111674.3.7.2..9.477777..1..16....926914.37.'

suite('Functional Tests', () => {
    // A
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle: validString
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'solution',validSolution) 
                done()
            })
    })
    // B
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:''
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Required field missing','there should be an error value.')
                done()
            })
    })
    // C
    test('Solve a puzzle with invalid characters: POST request to /api/solve',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37f'
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
            })
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37/'
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
            })
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37*'
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
                done()
            })
    })
    // D
    test('Solve a puzzle with incorrect length: POST request to /api/solve',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Expected puzzle to be 81 characters long','there should be an error value.')
                done()
            })
    })
    // E
    test('Solve a puzzle that cannot be solved: POST request to /api/solve',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .send({
                puzzle:imposibleString
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Puzzle cannot be solved')
                done()
            })
    })
    // F
    test('Check a puzzle placement with all fields: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                coordinate: 'a2',
                value: 3
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body)
                assert.propertyVal(res.body,'valid',true)
                done()
            })
    })
    // G
    test('Check a puzzle placement with single placement conflict: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                coordinate: 'a2',
                value: 9
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body)
                assert.propertyVal(res.body,'valid',false)
                assert.property(res.body,'conflict')
                assert.sameDeepMembers(res.body.conflict,['column'])
                done()
            })
    })
    // H
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                coordinate: 'a2',
                value: 6
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body)
                assert.propertyVal(res.body,'valid',false)
                assert.property(res.body,'conflict')
                assert.sameDeepMembers(res.body.conflict,['column','region'])
                done()
            })
    })
    // I
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                coordinate: 'a2',
                value: 2
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body)
                assert.propertyVal(res.body,'valid',false)
                assert.property(res.body,'conflict')
                assert.sameDeepMembers(res.body.conflict,['column','region','row'])
                done()
            })
    })

    // J
    test('Check a puzzle placement with missing required fields: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                coordinate: 'a1',
                value: 8
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body);
                assert.propertyVal(res.body, 'error', 'Required field(s) missing')
            })
        chai.request(server)
            .post('/api/check')
            .send({
                string: validString,
                value: 8
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body);
                assert.propertyVal(res.body, 'error', 'Required field(s) missing')
            })
        chai.request(server)
            .post('/api/check')
            .send({
                coordinate: 'a1',
                string: validString
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body);
                assert.propertyVal(res.body, 'error', 'Required field(s) missing')
            })
            done()
    })
    // K
    test('Check a puzzle placement with invalid characters: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37f',
                coordinate: 'a1',
                value: 1
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
            })
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37/',
                coordinate: 'a1',
                value: 1
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
            })
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37*',
                coordinate: 'a1',
                value: 1
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid characters in puzzle','there should be an error value.')
            })
            done()
    })
    // L
    test('Check a puzzle placement with incorrect length: POST request to /api/check',(done)=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: stringWithInvalidLength,
                coordinate: 'a1',
                value: 1
            })
            .end((err,res)=>{
                assert.equal(res.status,200);
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Expected puzzle to be 81 characters long','there should be an error value.')
                done()
            })
    })
    // M
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check',(done)=>{
        const invalidCoordinates = ['a-','p2','ax','g0', 'b71','*0']
        const coordinate = invalidCoordinates[Math.floor(Math.random() * invalidCoordinates.length)]
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                value: 1,
                coordinate
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body, 'response should be an object');
                assert.propertyVal(res.body,'error','Invalid coordinate')
            })
        done()
    })
    // N
    test('Check a puzzle placement with invalid placement value: POST request to /api/check',(done)=>{
        const invalidValues = [0,15,-3,56565]
        const value = invalidValues[Math.floor(Math.random() * invalidValues.length)]
        // const value = 56565
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validString,
                value,
                coordinate: 'a1'
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.isObject(res.body)
                assert.propertyVal(res.body,'error','Invalid value')
            })
        done()
    })
});

