import Cell from "../../puzzle/cell";
import React, {KeyboardEvent, memo} from "react";

const Row = ({idx, row, setCell, doValidate, validate }: {idx: string, row: Array<Cell>, setCell: Function, doValidate: boolean, validate: Function }) => {
    const handleKeyPress = (cell: Cell, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab") {
            return;
        }

        if (["Backspace", "Delete", "0"].includes(event.key)) {
            setCell(cell.id, null);
        } else {
            const newValue = parseInt(event.key);
            if (!newValue) {
                event.preventDefault();
                return;
            }
            setCell(cell.id, newValue);
        }

        validate();
    };

    const cells = row.map(cell => (
        <td key={cell.id} className={cell.immutable ? 'given' : doValidate && cell.broken ? "broken" : 'editable'}>
            <input type="text"
                   value={cell.value ?? ''}
                   disabled={cell.immutable}
                   onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => handleKeyPress(cell, event)}
                   onChange={() => {/*avoid a react warning*/}}
            />
        </td>
    ));

    return <tr key={idx}>{cells}</tr>;
};

export default memo(Row);