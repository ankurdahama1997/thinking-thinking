import { Cell } from "./Cell";
import { Compartment } from "./Compartment";

export class Environment {
    public readonly extracellularSpace: Compartment;
    public readonly cells: Cell[] = [];

    constructor(extracellularSpaceVolumeCubicMicrometers: number) {
        this.extracellularSpace = new Compartment("extracellular space", extracellularSpaceVolumeCubicMicrometers);
    }

    public addCell(cell: Cell): void {
        this.cells.push(cell);
    }
}