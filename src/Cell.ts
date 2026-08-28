import { Compartment } from "./Compartment";
import { Membrane } from "./Membrane";

export class Cell {
    public readonly id: string;
    public readonly cytosol: Compartment;
    public readonly plasmaMembrane: Membrane;

    constructor(
        id: string,
        cytosolVolumeCubicMicrometers: number,
        membraneAreaSquareMicrometers: number,
    ) {
        this.id = id;
        this.cytosol = new Compartment("cytosol", cytosolVolumeCubicMicrometers);
        this.plasmaMembrane = new Membrane(membraneAreaSquareMicrometers);
    }

    public step(dtSeconds: number): void {
        // Nothing changes yet. This is where membrane asks proteins about what happened during the last dtSeconds.
    }
}