import * as THREE from 'three';
import type { Cell } from '../Cell';

export class CellView {
  public readonly object = new THREE.Group();
  public readonly radius: number;

  constructor(private readonly cell: Cell) {
    this.object.name = this.cell.id;
    this.radius = this.radiusFromVolume(
      this.cell.cytosol.volumeCubicMicrometers,
    );

    this.object.add(this.createCytosol(), this.createMembrane());
  }

  private radiusFromVolume(volume: number): number {
    return Math.cbrt((3 * volume) / (4 * Math.PI));
  }

  private createCytosol(): THREE.Mesh {
    const cytosol = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 0.96, 64, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x40c9a2,
        opacity: 0.72,
        roughness: 0.55,
        transparent: true,
      }),
    );

    cytosol.name = this.cell.cytosol.name;
    return cytosol;
  }

  private createMembrane(): THREE.Mesh {
    const membrane = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 64, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x789cff,
        depthWrite: false,
        opacity: 0.26,
        roughness: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    );

    membrane.name = 'plasma membrane';
    return membrane;
  }
}
