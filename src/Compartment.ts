import { MolecularPopulation } from "./MolecularPopulation";

export class Compartment {
    public readonly name: string;
    public volumeCubicMicrometers: number;
    public readonly populations: MolecularPopulation[] = [];

    constructor(name: string, volumeCubicMicrometers: number) {
        this.name = name;
        this.volumeCubicMicrometers = volumeCubicMicrometers;
    }

    public addPopulation(population: MolecularPopulation) {
        this.populations.push(population);
    }
}