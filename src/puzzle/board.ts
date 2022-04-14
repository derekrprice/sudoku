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
                const sq = ((9 * i + j) / 3) >> 0;
                this.#columns[j] ||= [];
                this.#squares[sq] ||= [];
                const coord = Cell.xyToID(i, j);
                const newCell = new Cell(coord, i, j, sq, initializer[coord] || null);
                this.#squares[sq][this.#squares.length] = this.#index[coord] = this.#rows[i][j] = this.#columns[j][i] = newCell;
            }
        }
    }

    clear() {
        for(const cell of Object.values<Cell>(this.#index)) {
            if (!cell.immutable) {
                cell.value = null;
            }
        }
        return this.clone();
    }

    clone() {
        return new Board(this);
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

    setCell(id: string, value: any, immutable: boolean = false) {
        this.#index[id].immutable = immutable;
        this.#index[id].value = value;
        return this.clone();
    }
}
