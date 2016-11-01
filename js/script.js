'use strict';
var initial_board = [
    [1, 0, 0, 2, 3],
    [0, 0, 0, 4, 0],
    [0, 0, 4, 0, 0],
    [0, 2, 3, 0, 5],
    [0, 1, 5, 0, 0],
];
initial_board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0],
    [1, 2, 3, 1, 0, 0, 0],
    [6, 7, 0, 0, 0, 0, 4],
    [0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 0],
    [6, 7, 5, 0, 0, 0, 3],
];
var marked_board = [];
// marking solved cells
for (var i = 0; i < initial_board.length; i++) {
    marked_board[i] = [];
    for (var j = 0; j < initial_board[i].length; j++) {
        marked_board[i][j] = {
            val: initial_board[i][j],
            solved: initial_board[i][j] ? true : false,
            address: [i, j]
        };
    }
}
print_board(marked_board);
// solves a given board as much as possible
var solve = function (board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var currentval = cell.val;
            var adjacent_cells = adjacent(board, i, j);
            //let diagonal_cells = diagonal(board, i, j);
            var twins = find_twins(adjacent_cells, currentval);
            if (cell.solved && twins.count > 0) {
                board[i][j].solved = true;
                continue;
            }
            if (currentval !== 0) {
                if (twins.count < 2) {
                    var nextpos = void 0;
                    var count = adjacent_cells.length || 0;
                    while (count--) {
                        var cur = adjacent_cells[count];
                        if (cur !== undefined && cur.val === 0) {
                            if (nextpos === undefined) {
                                nextpos = cur.address;
                            }
                            else {
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
    }
    return board;
};
var b = solve(marked_board);
print_board(b);
console.log(find_twins(adjacent(b, 6, 1), 7));
console.log(is_solved(b));
// checks that the board is in a solved state
var is_solved = function (board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currentval = board[i][j].val;
            var adjacent_cells = adjacent(board, i, j);
            var twins = find_twins(adjacent_cells, currentval);
            if (currentval === 0) {
                return false;
            }
            if (board[i][j].solved) {
                if (twins.count !== 1) {
                    return false;
                }
                else {
                    continue;
                }
            }
            if (twins.count !== 2) {
                return false;
            }
        }
    }
    return true;
};
// counts the number of times currentval appears in source
var find_twins = function (source, currentval) {
    var temp = 0;
    var addresses = [];
    var count = source.length || 0;
    while (count--) {
        var cur = source[count];
        if (cur && (cur.val === currentval)) {
            temp++;
            addresses.push(cur.address);
        }
    }
    return {
        count: temp,
        addresses: addresses
    };
};
// counts the number of undefined values in source
var count_walls = function (source) {
    var temp = 0;
    var count = source.length || 0;
    while (count--) {
        if (source[count] === undefined) {
            temp++;
        }
    }
    return temp;
};
// travels in the M, N direction until the limit or the edge
var travel = function (board, m, n, M, N, limit) {
    limit = +limit;
    M = M || 0;
    N = N || 0;
    if (M === 0 && N === 0) {
        return [];
    }
    var temp = [];
    for (var i = 0; !(i >= limit); i++) {
        m += M;
        n += N;
        var _m = m >> 0;
        var _n = n >> 0;
        var cell = board[_m] && board[_m][_n];
        if (cell === undefined) {
            break;
        }
        temp.push(cell);
    }
    return temp;
};
// returns array of all adjacent neighbor cells
var adjacent = function (board, m, n) {
    var temp = [];
    temp.push(board[m] && board[m][n + 1]);
    temp.push(board[m] && board[m][n - 1]);
    temp.push(board[m + 1] && board[m + 1][n]);
    temp.push(board[m - 1] && board[m - 1][n]);
    return temp;
};
// returns array of all diagonal neighbor cells
var diagonal = function (board, m, n) {
    var temp = [];
    temp.push(board[m + 1] && board[m + 1][n + 1]);
    temp.push(board[m - 1] && board[m - 1][n - 1]);
    temp.push(board[m + 1] && board[m + 1][n - 1]);
    temp.push(board[m - 1] && board[m - 1][n + 1]);
    return temp;
};
// returns array of all neighbor cells 
var neighbors = function (board, m, n) {
    return adjacent(board, m, n).concat(diagonal(board, m, n));
};
// prints board to console
var print_board = function (board) {
    var temp = '';
    for (var i = 0; i < board.length; i++) {
        temp += '..';
        for (var j = 0; j < board[i].length; j++) {
            temp += ((board[i][j].solved) ? 'x' : '.' || '.') + "..";
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
    temp = '';
    for (var i = 0; i < board.length; i++) {
        temp += '..';
        for (var j = 0; j < board[i].length; j++) {
            temp += (board[i][j].val || '.') + "..";
        }
        temp += '\n';
    }
    console.log('\n' + temp.trim());
};
