const chars = "ABCDEFGHI";

export default class Cell {
    id: string;
    immutable: boolean;
    value: number | null;

    constructor(id: string, value: number | null = null) {
        this.id = id
        this.value = value;
        this.immutable = false;
    }

    static xyToID(row: number, column: number): string {
        return chars.charAt(row) + (column + 1);
    }

    static idToXY(id: string): Array<number> {
        const [char, column] = id.split('');
        return [chars.indexOf(char), parseInt(column)];
    }
}
