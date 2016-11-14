# num-match

A brute force solver for number matching games like [Flow Free](https://play.google.com/store/apps/details?id=com.bigduckgames.flow&hl=en).

A puzzle must have a unique solution, and paths cannot touch themselves.

Most simple puzzles (under 7x7) will be solved very quickly since there are little assumptions to make and the board can be solved one cell at a time. However, once the board get larger and the number of initial colors smaller, run time will increase dramatically.