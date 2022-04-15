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

    setCell(id: string, value: any, immutable: boolean = false) {
        this.#index[id].immutable = immutable;
        this.#index[id].value = value;
        return this.clone();
    }

    validate(doIt: boolean) {
        let broken = false;
        let full = true;
        for (const cell of Object.values<Cell>(this.#index)) {
            full &&= !!cell.value;
            cell.broken = doIt && !cell.immutable && !!cell.value && this.#checkCell(cell);
            broken ||= cell.broken;
        }
        if (doIt) {
            this.#status = broken ? "broken" : full ? "solved" : "unsolved";
        }
        return this.clone();
    }

    #checkCell(cell: Cell, value: number | null = null) {
        if (!value) {
            value = cell.value
        }
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
}
