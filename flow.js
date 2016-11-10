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
// tries to solve a board while making assumptions when unsure
var smart_solve = function (board) {
    var temp = solve_absolute(board);
    if (temp.solved) {
        return temp;
    }
    for (var i = 0; i < temp.board.length; i++) {
        for (var j = 0; j < temp.board[i].length; j++) {
            var cell = temp.board[i][j];
            var currentval = cell.val;
            // empty cell
            if (currentval === 0) {
                continue;
            }
            var adjacent_cells = adjacent(temp.board, i, j);
            var twins = find_around(adjacent_cells, currentval);
            var empty = find_around(adjacent_cells, 0);
            if (empty.length === 2 && !cell.solved && twins.length < 2) {
                var dupe1 = temp.board.slice(0);
                dupe1[String(empty[0][0])][String(empty[0][1])] = {
                    val: currentval,
                    solved: false,
                    address: [i, j]
                };
                console.log('assume1');
                print_board(dupe1, false);
                var dupe1_res = smart_solve(dupe1);
                if (dupe1_res.solved) {
                    return dupe1_res;
                }
                var dupe2 = temp.board.slice(0);
                dupe2[String(empty[1][0])][String(empty[1][1])] = {
                    val: currentval,
                    solved: false,
                    address: [i, j]
                };
                console.log('assume2');
                print_board(dupe2, false);
                var dupe2_res = smart_solve(dupe1);
                if (dupe2_res.solved) {
                    return dupe2_res;
                }
            }
        }
    }
    return {
        solved: false,
        board: temp.board
    };
};
// tries solve a given board as much as possible
var solve_absolute = function (board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var currentval = cell.val;
            // empty cell
            if (currentval === 0) {
                continue;
            }
            var adjacent_cells = adjacent(board, i, j);
            var twins = find_around(adjacent_cells, currentval);
            // is already solved
            if (cell.solved && twins.length > 0) {
                continue;
            }
            // is newly solved
            if (twins.length === 2) {
                board[i][j].solved = true;
                continue;
            }
            // needs a successor
            if (twins.length < 2) {
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
                    print_board(board, false);
                    board[i][j].solved = true;
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
};
// checks that the board is in a solved state
var is_solved = function (board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currentval = board[i][j].val;
            var adjacent_cells = adjacent(board, i, j);
            var twins = find_around(adjacent_cells, currentval);
            if (currentval === 0) {
                return false;
            }
            if (board[i][j].solved) {
                if (twins.length !== 1) {
                    return false;
                }
                else {
                    continue;
                }
            }
            if (twins.length !== 2) {
                return false;
            }
        }
    }
    return true;
};
// counts the number of times currentval appears in source
var find_around = function (source, currentval) {
    var addresses = [];
    var count = source.length || 0;
    while (count--) {
        var cur = source[count];
        if (cur && (cur.val === currentval)) {
            addresses.push(cur.address);
        }
    }
    return addresses;
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
var print_board = function (board, solve) {
    var temp = '';
    if (solve) {
        for (var i = 0; i < board.length; i++) {
            temp += '>  ..';
            for (var j = 0; j < board[i].length; j++) {
                temp += ((board[i][j].solved) ? 'x' : '.' || '.') + "..";
            }
            temp += '\n';
        }
        console.log('\n' + temp.trim());
    }
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
print_board(marked_board, true);
var b = smart_solve(marked_board);
print_board(b.board, true);
console.log(b.solved);
