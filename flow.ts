'use strict';

interface Cell {
    val: number;
    anchor: boolean;
    address: Number[];
}

// keeping track of the number of assumptions
var assumptions = 0;

// test boards
var boards: number[][][] = [
    
    // padding the front of the array
    undefined,undefined,undefined,

    // 3x3
   [[1,2,3],
    [0,2,0],
    [0,1,3]],

    // 4x4
   [[0,1,3,3],
    [0,2,4,0],
    [0,0,0,0],
    [0,1,2,4]],

    // 5x5
   [[1,0,0,2,3],
    [0,0,0,4,0],
    [0,0,4,0,0],
    [0,2,3,0,5],
    [0,1,5,0,0]],

    // 6x6
   [[0,0,0,0,0,0],
    [2,1,5,4,0,0],
    [1,0,0,6,0,0],
    [6,0,0,0,0,2],
    [0,5,0,0,4,3],
    [0,0,0,3,0,0]],

    // 7x7
   [[0,0,0,0,0,0,0],
    [0,0,0,0,0,2,0],
    [1,2,3,1,0,0,0],
    [6,7,0,0,0,0,4],
    [0,0,0,4,0,0,0],
    [0,0,0,0,0,5,0],
    [6,7,5,0,0,0,3]],

    // 8x8
   [[3,0,0,0,0,0,0,0],
    [4,6,0,5,0,0,0,0],
    [0,0,3,0,0,8,0,0],
    [0,6,2,0,0,0,0,0],
    [0,0,7,0,8,0,0,0],
    [1,0,4,0,7,2,1,0],
    [0,0,0,0,0,0,0,0],
    [5,0,0,0,0,0,0,0]],

    // 9x9
   [[1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,0],
    [0,0,3,0,0,0,0,0,0],
    [0,0,0,0,0,4,0,0,7],
    [0,0,0,0,0,5,0,0,8],
    [0,0,0,0,0,0,0,0,6],
    [0,0,0,4,0,0,0,0,0],
    [0,3,0,1,5,7,8,0,0],
    [0,0,0,2,6,0,0,0,0]]
];

// Choose board to solve ([7] => 7x7)
var initial_board = boards[9];

// tries to solve a board while making assumptions when unsure
var smart_solve = function(board: Cell[][], change?: Cell): {solved: boolean, board: Cell[][]} {
    // make specified change if required
    if (change !== undefined) {
        board[String(change.address[0])][String(change.address[1])] = change;
    }
    // attempt to solve
    let temp = solve_absolute(board);
    if (temp.solved) {
        return temp;
    }
    // loop through cells
    for (let i = 0; i < temp.board.length; i++) {
        for (let j = 0; j < temp.board[i].length; j++) {
            let cell = temp.board[i][j];
            let currentval = cell.val;
            // empty cells
            if (currentval === 0) {
                continue;
            }
            let adjacent_cells = adjacent(temp.board, i, j);
            let twins = find_around(adjacent_cells, currentval);
            let empty = find_around(adjacent_cells, 0);
            // cells with two alternatives
            if(empty.length === 2 && ((!cell.anchor && twins.length < 2) || (cell.anchor && twins.length === 0))) {
                // attempt to smart solve each possible option
                let option1 = smart_solve((JSON.parse(JSON.stringify(temp.board))), {
                    val: currentval,
                    address: [Number(empty[0][0]),Number(empty[0][1])],
                    anchor: false
                });
                if (option1.solved) {
                    assumptions++;
                    return option1;
                }
                let option2 = smart_solve((JSON.parse(JSON.stringify(temp.board))), {
                    val: currentval,
                    address: [Number(empty[1][0]),Number(empty[1][1])],
                    anchor: false
                });
                if (option2.solved) {
                    assumptions++;
                    return option2;
                }
            }
        }
    }
    return temp;
}

// tries solve a given board with guaranteed values
var solve_absolute = function(board: Cell[][]): {solved: boolean, board: Cell[][]} {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let cell = board[i][j];
            let currentval = cell.val;
            // empty cell
            if (currentval === 0) {
                continue;
            }
            let adjacent_cells = adjacent(board, i, j);
            let twins = find_around(adjacent_cells, currentval);
            // is already solved
            if (cell.anchor && twins.length === 1) {
                continue;
            }
            // is newly solved
            if (twins.length === 2) {
                continue;
            }
            // needs a successor
            if(twins.length < 2) {
                let nextpos;
                let count = adjacent_cells.length || 0;
                // find singular empty cell in adjacent
                while (count--) {
                    let cur = adjacent_cells[count];
                    if (cur !== undefined && cur.val === 0) {
                        if (nextpos === undefined) {
                            nextpos = cur.address;
                        } else {
                            nextpos = null;
                            break;
                        }
                    }
                }
                if (nextpos !== null && nextpos !== undefined) {
                    board[nextpos[0]][nextpos[1]].val = currentval;
                    i = 0;
                    j = -1;
                    continue;
                }
            }
        }
    }
    return {
        solved: is_solved(board),
        board: board
    };
}

// checks that the board is in a solved state
var is_solved = function(board: Cell[][]): boolean {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let currentval = board[i][j].val;
            let adjacent_cells = adjacent(board, i, j);
            let twins = find_around(adjacent_cells, currentval);
            // cell has a value
            if (currentval === 0) {
                return false;
            }
            // anchors have single twin
            if (board[i][j].anchor) {
                if (twins.length !== 1) {
                    return false;
                } else {
                    continue;
                }
            }
            // other cells have exactly two twins
            if (twins.length !== 2) {
                return false;
            }
        }
    }
    return true;
}

// counts the number of times currentval appears in source at .val
var find_around = function(source: Cell[], currentval: number): Number[][] {
    let addresses = [];
    let count = source.length || 0;
    while (count--) {
        let cur = source[count];
        if (cur && (cur.val === currentval)) {
            addresses.push(cur.address);
        } 
    }
    return addresses;
}

// returns array of all adjacent neighbor cells
var adjacent = function(board: Cell[][], m: number, n: number): Cell[] {
    let temp = [];
    temp.push(board[m] && board[m][n+1]);
    temp.push(board[m] && board[m][n-1]);
    temp.push(board[m+1] && board[m+1][n]);
    temp.push(board[m-1] && board[m-1][n]);
    return temp;
}

// prints board to console
var print_board = function(board: Cell[][]): void {
    let temp = '';
    for (let i = 0; i < board.length; i++) {
        temp += '..';
        for (let j = 0; j < board[i].length; j++) {
            temp += `${board[i][j].val||'.'}..`;
        }
        temp += '\n';
    }
    console.log(temp.trim() + '\n');
}

// solving
if (initial_board === undefined) {
    console.log(`\nplease choose a value from 3 and ${boards.length-1}`);
} else {
    // marking anchor cells
    var marked_board: Cell[][] = [];
    for (let i = 0; i < initial_board.length; i++) {
        marked_board[i] = [];
        for (let j = 0; j < initial_board[i].length; j++) {
            marked_board[i][j] = {
                val: initial_board[i][j],
                anchor: initial_board[i][j]?true:false,
                address: [i,j]
            }
        }
    }

    console.log('\ninitial board:');
    print_board(marked_board);
    var b = smart_solve(marked_board);
    if (b.solved) {
        console.log('solved with ' + assumptions + ' assumptions:')
        print_board(b.board);
    } else {
        console.log('could not solve');
        print_board(b.board);
    }
}