class SudokuSolver {

  validate(puzzleString) {
    if(puzzleString.length !== 81) return {valid: false, error: 'Expected puzzle to be 81 characters long' }
    if(puzzleString.match(/[^\.\d]/gi)) return {valid: false, error: 'Invalid characters in puzzle' }
    return {valid: true}
  }
  checkPosition(puzzle,row,column,value){
    if(!this.checkRowPlacement(puzzle,row,column,value)) return false
    else if(!this.checkColPlacement(puzzle,row,column,value)) return false
    else if(!this.checkRegionPlacement(puzzle,row,column,value)) return false
    else return true
  }
  getNumberedRow(row){
    if(row.toLowerCase() === 'a') return 0
    if(row.toLowerCase() === 'b') return 1
    if(row.toLowerCase() === 'c') return 2
    if(row.toLowerCase() === 'd') return 3
    if(row.toLowerCase() === 'e') return 4
    if(row.toLowerCase() === 'f') return 5
    if(row.toLowerCase() === 'g') return 6
    if(row.toLowerCase() === 'h') return 7
    if(row.toLowerCase() === 'i') return 8
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowArray = []
    for(let i=0; i < 9; i++){
      const xRow = []
        for(let j = 0; j < 9; j++){
          xRow.push(puzzleString[(i*9)+j])
        }
      rowArray.push(xRow)
    }
    const actualRow = rowArray[row]
    const rowPlacement = actualRow.filter(number=>number == value)
    if(rowPlacement.length > 1) return false
    else if(actualRow[column - 1] == value) return true
    else if(rowPlacement.length == 1) return false
    else return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colArray = []
    for(let i=0; i < 9; i++){
      const xCol = []
        for(let j = 0; j < 9; j++){
          xCol.push(puzzleString[(j*9)+i])
        }
      colArray.push(xCol)
    }
    const actualCol = colArray[column - 1]
    const colPlacement = actualCol.filter(number=>number == value)
    if(colPlacement.length > 1) return false
    else if(actualCol[row] == value) return true
    else if(colPlacement.length == 1) return false
    else return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
  let regArray = []
    for(let reg = 0; reg <3; reg++){
      for(let i=0; i < 3; i++){
        const xReg = []
          for(let j = 0; j < 3; j++){
            for(let k= 0; k < 3; k++){
              xReg.push(puzzleString[(reg*27)+(i*3)+(j*9)+k])
            }
          }
        regArray.push(xReg)
      }
    }
    const actualRegion = regArray[(Math.floor(row/3)*3)+Math.floor((column-1)/3)]
    let rowIndex = row %3;
    const index = (rowIndex *3) + ((column - 1)%3);
    const regionPlacement = actualRegion.filter(number=>number== value)
    if(regionPlacement.length > 1) return false
    else if(actualRegion[index] == value) return true
    else if(regionPlacement.length == 1) return false
    else return true
  }

  solve(puzzleString) {
    let puzzleSolution = puzzleString.split("")
    let i = 0;
    let insolvableFlag = false
    puzzleSolution.forEach((string,index)=>{
      if(string !== '.'){
      const column = (index%9)+1
      const row = Math.floor(index/9)
        if(!this.checkPosition(puzzleString,row,column,string)) return insolvableFlag = true
      }
      return
    })
    if(insolvableFlag) return false
    do {
      puzzleSolution = puzzleSolution.map((cell,index)=>{
        if(cell === '.'){
          return this.getSolution(puzzleSolution.join(''),index)
        }
        else return cell
      })
      i++
    } while(puzzleSolution.find(string=>string==='.') && i < 10)
    return puzzleSolution.join('')
  }
    getSolution(puzzle,index){
      const column = (index%9)+1
      const row = Math.floor(index/9)
      let solutionArray = []
      for(let i = 1; i < 10;i++){
        if(!this.checkPosition(puzzle,row,column,i)) continue
        else solutionArray.push(i)
      }
      if(solutionArray.length === 1) return solutionArray[0]
      else return `.`
  }
}

module.exports = SudokuSolver;

