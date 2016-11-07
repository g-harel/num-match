'use strict';

interface Cell {
    val: number;
    solved: boolean;
    address: Number[];
}

var initial_board: number[][] = [
    [1,0,0,2,3],
    [0,0,0,4,0],
    [0,0,4,0,0],
    [0,2,3,0,5],
    [0,1,5,0,0],
];

initial_board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,2,0],
    [1,2,3,1,0,0,0],
    [6,7,0,0,0,0,4],
    [0,0,0,4,0,0,0],
    [0,0,0,0,0,5,0],
    [6,7,5,0,0,0,3],
]

var marked_board: Cell[][] = [];

// marking solved cells
for (let i = 0; i < initial_board.length; i++) {
    marked_board[i] = [];
    for (let j = 0; j < initial_board[i].length; j++) {
        marked_board[i][j] = {
            val: initial_board[i][j],
            solved: initial_board[i][j]?true:false,
            address: [i,j]
        }
    }
}

// solves a given board as much as possible
var solve = function(board: Cell[][]): Cell[][] {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let cell = board[i][j];
            let currentval = cell.val;
            if (currentval === 0) {
                continue;
            }
            let adjacent_cells = adjacent(board, i, j);
            let twins = find_twins(adjacent_cells, currentval);
            if (cell.solved && twins.count > 0) {
                continue;
            }
            if (twins.count === 2) {
                board[i][j].solved = true;
                continue;
            }
            if(twins.count < 2) {
                let nextpos;
                let count = adjacent_cells.length || 0;
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
                    board[i][j].solved = true;
                    i = 0;
                    j = -1;
                    continue;
                }
            }
        }
    }
    return board;
}

// checks that the board is in a solved state
var is_solved = function(board: Cell[][]): boolean {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let currentval = board[i][j].val;
            let adjacent_cells = adjacent(board, i, j);
            let twins = find_twins(adjacent_cells, currentval);
            if (currentval === 0) {
                return false;
            }
            if (board[i][j].solved) {
                if (twins.count !== 1) {
                    return false;
                } else {
                    continue;
                }
            }
            if (twins.count !== 2) {
                return false;
            }
        }
    }
    return true;
}

// counts the number of times currentval appears in source
var find_twins = function(source: Cell[], currentval: number) {
    let temp = 0;
    let addresses: Number[][] = [];
    let count = source.length || 0;
    while (count--) {
        let cur = source[count];
        if (cur && (cur.val === currentval)) {
            temp++;
            addresses.push(cur.address);
        } 
    }
    return {
        count: temp,
        addresses: addresses
    };
}

// counts the number of undefined values in source
var count_walls = function(source: Cell[]): number {
    let temp = 0;
    let count = source.length || 0;
    while (count--) {
       if (source[count] === undefined) {
            temp++;
        } 
    }
    return temp;
}

// travels in the M, N direction until the limit or the edge
var travel = function(board: Cell[][], m: number, n: number, M: number, N: number, limit: number): Cell[] {
    limit = +limit;
    M = M || 0;
    N = N || 0;
    if (M === 0 && N === 0) {
        return [];
    }
    let temp = [];
    for (let i = 0; !(i >= limit); i++) {
        m += M;
        n += N;
        let _m = m >> 0;
        let _n = n >> 0;
        let cell = board[_m] && board[_m][_n];
        if (cell === undefined) {
            break;
        }
        temp.push(cell);
    }
    return temp;
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

// returns array of all diagonal neighbor cells
var diagonal = function(board: Cell[][], m: number, n: number): Cell[] {
    let temp = [];
    temp.push(board[m+1] && board[m+1][n+1]);
    temp.push(board[m-1] && board[m-1][n-1]);
    temp.push(board[m+1] && board[m+1][n-1]);
    temp.push(board[m-1] && board[m-1][n+1]);
    return temp;
}

// returns array of all neighbor cells 
var neighbors = function(board: Cell[][], m: number, n: number): Cell[] {
    return adjacent(board, m, n).concat(diagonal(board, m, n));
}

// prints board to console
var print_board = function(board: Cell[][]): void {
    let temp = '';
    for (let i = 0; i < board.length; i++) {
        temp += '..';
        for (let j = 0; j < board[i].length; j++) {
            temp += `${(board[i][j].solved)?'x':'.'||'.'}..`;
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
    temp = '';
    for (let i = 0; i < board.length; i++) {
        temp += '..';
        for (let j = 0; j < board[i].length; j++) {
            temp += `${board[i][j].val||'.'}..`;
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
}

print_board(marked_board);
var b = solve(marked_board);
print_board(b);
console.log(find_twins(adjacent(b, 6, 1), 7));
console.log(is_solved(b));