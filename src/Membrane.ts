import { MolecularPopulation } from "./MolecularPopulation";

export class Membrane {
    public areaSquareMicrometers: number;
    public readonly embeddedPopulations: MolecularPopulation[] = [];
    
    constructor(areaSquareMicrometers: number) {
        this.areaSquareMicrometers = areaSquareMicrometers;
    }

    public embed(population: MolecularPopulation): void {
        this.embeddedPopulations.push(population);
    }
}