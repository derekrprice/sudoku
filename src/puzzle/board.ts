import Cell from "./cell";

type BoardArray = Array<Array<Cell>>;
export default class Board {
    #columns: BoardArray;
    #index: any;
    #rows: BoardArray;
    #squares: BoardArray;
    #status: "broken" | "solved" | "unsolvable" | "unsolved";

    constructor(initializer: any = {}) {
        if (initializer instanceof Board) {
            this.#index = initializer.cells;
            this.#rows = initializer.rows;
            this.#columns = initializer.columns;
            this.#squares = initializer.squares;
            this.#status = initializer.status;
            return;
        }

        this.#status = "unsolved";
        this.#columns = [];
        this.#index = {};
        this.#rows = [];
        this.#squares = [];
        for (let i = 0; i < 9; i++) {
            this.#rows[i] = [];
            for (let j = 0; j < 9; j++) {
                const sq = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                this.#columns[j] ||= [];
                this.#squares[sq] ||= [];
                const coord = Cell.xyToID(i, j);
                const newCell = new Cell(coord, i, j, sq, parseInt(initializer[coord]) || null);
                this.#squares[sq][this.#squares[sq].length] = this.#index[coord] = this.#rows[i][j] = this.#columns[j][i] = newCell;
            }
        }
    }

    get cells() {
        return this.#index;
    }

    get columns() {
        return this.#columns;
    }

    get rows() {
        return this.#rows;
    }

    get squares() {
        return this.#squares;
    }

    get status() {
        return this.#status;
    }

    /**
     * @return a clone of this object with all the mutable cells on the board cleared.
     */
    clear(): Board {
        for(const cell of Object.values<Cell>(this.#index)) {
            if (!cell.immutable) {
                cell.value = null;
                cell.broken = false;
            }
        }
        return this.clone();
    }

    /**
     * @return a clone of this object.
     */
    clone(): Board {
        return new Board(this);
    }

    /**
     * Assign value to a cell.
     *
     * @param {string} id The ID of the cell to update.
     * @param {number | null} value The value to assign to this cell.
     * @param {boolean} immutable Mark this cell as read-only.  Defaults to false.
     * @return a clone of this object, after setting value for the cell with the given id.
     */
    setCell(id: string, value: number | null, immutable: boolean = false): Board {
        this.#index[id].immutable = immutable;
        this.#index[id].value = value;
        return this.clone();
    }

    /**
     * Solve the puzzle..
     */
    solve(): Board {
        this.validate(true);
        if (this.#status === "broken") {
            this.#status = "unsolvable";
            return this.clone();
        }

        const unsolved = Object.values<Cell>(this.#index).filter(cell => !cell.value);
        return this.#search(unsolved) || this;
    }

    /**
     * Mark any broken cells as such and set the board status.
     * @param {boolean} doIt When false, reset all validations instead.
     * @return a clone of this object with the updated status.
     */
    validate(doIt: boolean): Board {
        let broken = false;
        let full = true;
        for (const cell of Object.values<Cell>(this.#index)) {
            full &&= !!cell.value;
            cell.broken = doIt && !cell.immutable && !!cell.value && this.#checkCell(cell, cell.value);
            broken ||= cell.broken;
        }
        if (doIt) {
            this.#status = broken ? "broken" : full ? "solved" : "unsolved";
        }
        return this.clone();
    }

    /**
     * Check to make sure a value is not duplicated in a cell's row, column, or square.
     *
     * @param cell
     * @param {number} value The value to check for this cell.  If null, use cell.value.
     * @return true if value is invalid for this cell.
     * @private
     */
    #checkCell(cell: Cell, value: number): boolean {
        const column = this.#columns[cell.column];
        const row = this.#rows[cell.row];
        const square = this.#squares[cell.square];
        const equalsCell = (cohort: Cell) => cell.id !== cohort.id && cohort.value === value;
        return (
            column.some(equalsCell)
            || row.some(equalsCell)
            || square.some(equalsCell)
        );
    }

    #search(emptyCells: Array<Cell>): Board | false {
        if (!emptyCells.length) {
            // Woot!  Solved!
            return this.clone();
        }

        for (let value = 1; value <= 9; value++) {
            if (!this.#checkCell(emptyCells[0], value)) {
                emptyCells[0].value = value;
                const found = this.#search(emptyCells.slice(1));
                if (found) {
                    return found;
                }
            }
        }
        emptyCells[0].value = null;
        return false;
    }
}
