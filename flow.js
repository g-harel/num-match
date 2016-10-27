'use strict';

let board = [
    [1,0,0,2,3],
    [0,0,0,4,0],
    [0,0,4,0,0],
    [0,2,3,0,5],
    [0,1,5,0,0],
];

// marking solved cells
for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        board[i][j] = {
            val: board[i][j],
            solved: board[i][j]?true:false
        }
    }
}

print();

for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        let currentval = board[i][j].val;
        let adjacent_cells = adjacent(board, i, j);
        let diagonal_cells = diagonal(board, i, j);
        if (currentval !== 0) {
            if(count_twins(adjacent_cells, currentval) < 2) {
                let nextpos = adjacent_cells.reduce(function(pre, cur) {
                    if (cur === undefined) {
                        return pre;
                    }
                    if (pre === null) {
                        return null;
                    }
                    if (cur.val === 0) {
                        if (pre === undefined) {
                            return cur.address;
                        } else {
                            pre = null;
                        }
                    }
                    return pre;
                }, undefined);
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

print();
console.log(is_solved(board))


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
    return source.reduce(function(pre, cur) {
        if (cur && (cur.val === currentval)) {
            return pre + 1;
        } else {
            return pre;
        }
    }, 0)
}

// counts the number of undefined values in source
function count_walls(source) {
    return source.reduce(function(pre, cur) {
        if (cur === undefined) {
            return pre + 1;
        } else {
            return pre;
        }
    }, 0)
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
        let _m = Math.floor(m + M*i);
        let _n = Math.floor(n + N*i);
        let cell = board[_m] && board[_m][_n];
        if (!cell) {
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
function print() {
    let temp = '';
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            temp += `${board[i][j].val||' '}  `;
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
}