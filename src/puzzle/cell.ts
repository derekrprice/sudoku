const chars = "ABCDEFGHI";

export default class Cell {
    id: string;
    broken: boolean;
    immutable: boolean;
    value: number | null;

    #column: number;
    #row: number;
    #square: number;

    constructor(id: string, row: number, column: number, square: number, value: number | null = null) {
        this.broken = false;
        this.id = id
        this.immutable = !!value;
        this.value = value;

        this.#column = column;
        this.#row = row;
        this.#square = square;
    }

    static xyToID(row: number, column: number): string {
        return chars.charAt(row) + (column + 1);
    }

    static idToXY(id: string): Array<number> {
        const [char, column] = id.split('');
        return [chars.indexOf(char), parseInt(column)];
    }

    get column() {
        return this.#column;
    }

    get row() {
        return this.#row;
    }

    get square() {
        return this.#square;
    }
}
