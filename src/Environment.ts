import { Cell } from "./Cell";
import { Compartment } from "./Compartment";

export class Environment {
    public readonly extracellularSpace: Compartment;
    public readonly cells: Cell[] = [];
    public readonly dtSeconds: number;
    private stepCount = 0

    constructor(extracellularSpaceVolumeCubicMicrometers: number, dtSeconds: number) {
        this.extracellularSpace = new Compartment("extracellular space", extracellularSpaceVolumeCubicMicrometers);
        this.dtSeconds = dtSeconds;
    }

    public addCell(cell: Cell): void {
        this.cells.push(cell);
    }

    public timeSeconds(): number {
        return this.stepCount * this.dtSeconds;
    }

    public step(): void {
        for (const cell of this.cells) {
            cell.step(this.dtSeconds);
        }
        this.stepCount += 1;
    }
}