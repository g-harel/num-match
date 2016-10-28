'use strict';

let initial_board = [
    [1,0,0,2,3],
    [0,0,0,4,0],
    [0,0,4,0,0],
    [0,2,3,0,5],
    [0,1,5,0,0],
];

// marking solved cells
for (let i = 0; i < initial_board.length; i++) {
    for (let j = 0; j < initial_board[i].length; j++) {
        initial_board[i][j] = {
            val: initial_board[i][j],
            solved: initial_board[i][j]?true:false
        }
    }
}

print(initial_board);

// solves a given board as much as possible
function solve(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let currentval = board[i][j].val;
            let adjacent_cells = adjacent(board, i, j);
            let diagonal_cells = diagonal(board, i, j);
            let twins_count = count_twins(adjacent_cells, currentval);
            if (currentval !== 0) {
                if(twins_count < 2) {
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
                        i = 0;
                        j = -1;
                        continue;
                    }
                }
            }
        }
    }
    return board;
}

let b = solve(initial_board);
print(b);
console.log(is_solved(b));


// checks that the board is in a solved state
function is_solved(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let currentval = board[i][j].val;
            let adjacent_cells = adjacent(board, i, j);
            let twins = count_twins(adjacent_cells, currentval);
            if (currentval === 0) {
                return false;
            }
            if (board[i][j].solved) {
                if (twins !== 1) {
                    return false;
                } else {
                    continue;
                }
            }
            if (twins !== 2) {
                return false;
            }
        }
    }
    return true;
}

// counts the number of times currentval appears in source
function count_twins(source, currentval) {
    let temp = 0;
    let count = source.length || 0;
    while (count--) {
        let cur = source[count];
        if (cur && (cur.val === currentval)) {
            temp++;
        } 
    }
    return temp;
}

// counts the number of undefined values in source
function count_walls(source) {
    let temp = 0;
    let count = source.length || 0;
    while (count--) {
       if (source[count] === undefined) {
            temp++;
        } 
    }
}

// travels in the M, N direction until the limit or the edge
function travel(board, m, n, M, N, limit) {
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
        temp[i].address = [_m, _n];
    }
    return temp;
}

// returns array of all adjacent neighbor cells
function adjacent(board, m, n) {
    let temp = [];
    temp.push(board[m] && board[m][n+1]);
    if (temp[0]) {
        temp[0].address = [m,n+1];
    }
    temp.push(board[m] && board[m][n-1]);
    if (temp[1]) {
        temp[1].address = [m,n-1];
    }
    temp.push(board[m+1] && board[m+1][n]);
    if (temp[2]) {
        temp[2].address = [m+1,n];
    }
    temp.push(board[m-1] && board[m-1][n]);
    if (temp[3]) {
        temp[3].address = [m-1,n];
    }
    return temp;
}

// returns array of all diagonal neighbor cells
function diagonal(board, m, n) {
    let temp = [];
    temp.push(board[m+1] && board[m+1][n+1]);
    if (temp[0]) {
        temp[0].address = [m,n+1];
    }
    temp.push(board[m-1] && board[m-1][n-1]);
    if (temp[1]) {
        temp[1].address = [m,n-1];
    }
    temp.push(board[m+1] && board[m+1][n-1]);
    if (temp[2]) {
        temp[2].address = [m+1,n];
    }
    temp.push(board[m-1] && board[m-1][n+1]);
    if (temp[3]) {
        temp[3].address = [m-1,n];
    }
    return temp;
}

// returns array of all neighbor cells 
function neighbors(board, m, n) {
    return adjacent(board, m, n).concat(diagonal(board, m, n));
}

// prints board to console
function print(board) {
    let temp = '';
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            temp += `${board[i][j].val||' '}  `;
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
}