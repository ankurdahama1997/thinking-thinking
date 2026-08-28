import { MolecularSpecies } from "./MolecularSpecies";

export class MolecularPopulation {
    public readonly species: MolecularSpecies;
    public moleculeCount: number;

    constructor(species: MolecularSpecies, moleculeCount: number) {
        this.species = species;
        this.moleculeCount = moleculeCount;
    }
}