import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Environment } from '../Environment';
import { CellView } from './CellView';

export class EnvironmentView {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1_000);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly controls: OrbitControls;
  private readonly cellViews: CellView[];

  constructor(
    private readonly container: HTMLElement,
    private readonly environment: Environment,
  ) {
    this.scene.background = new THREE.Color(0x050811);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;

    this.cellViews = this.environment.cells.map((cell) => new CellView(cell));

    this.addLighting();
    this.addCells();
    this.resize();
    this.positionCamera();

    new ResizeObserver(() => this.resize()).observe(this.container);
    this.renderer.setAnimationLoop(() => this.render());
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x101426, 2.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(8, 10, 12);
    this.scene.add(keyLight);
  }

  private addCells(): void {
    const largestRadius = Math.max(
      ...this.cellViews.map((cellView) => cellView.radius),
      1,
    );
    const margin = largestRadius * 0.25;
    const minimumDistance = largestRadius * 2 + margin;
    const positions = this.createPackedPositions(
      this.cellViews.length,
      minimumDistance,
    );

    this.cellViews.forEach((cellView, index) => {
      cellView.object.position.copy(positions[index]);
      this.scene.add(cellView.object);
    });
  }

  private createPackedPositions(
    count: number,
    minimumDistance: number,
  ): THREE.Vector3[] {
    if (count === 0) {
      return [];
    }

    const latticeUnit = minimumDistance / Math.SQRT2;
    let extent = 0;
    let points: Array<[number, number, number]> = [];

    while (points.length < count) {
      extent += 1;
      points = [];

      for (let x = -extent; x <= extent; x += 1) {
        for (let y = -extent; y <= extent; y += 1) {
          for (let z = -extent; z <= extent; z += 1) {
            if ((x + y + z) % 2 === 0) {
              points.push([x, y, z]);
            }
          }
        }
      }
    }

    const distanceSquared = ([x, y, z]: [number, number, number]) =>
      x * x + y * y + z * z;

    points.sort(
      (a, b) =>
        distanceSquared(a) - distanceSquared(b) ||
        a[0] - b[0] ||
        a[1] - b[1] ||
        a[2] - b[2],
    );

    const available = new Set(points.map((point) => point.join(',')));
    const used = new Set<string>();
    const ordered: Array<[number, number, number]> = [];

    for (const point of points) {
      const key = point.join(',');

      if (used.has(key)) {
        continue;
      }

      ordered.push(point);
      used.add(key);

      const opposite: [number, number, number] = [
        -point[0],
        -point[1],
        -point[2],
      ];
      const oppositeKey = opposite.join(',');

      if (oppositeKey !== key && available.has(oppositeKey)) {
        ordered.push(opposite);
        used.add(oppositeKey);
      }
    }

    return ordered.slice(0, count).map(
      ([x, y, z]) =>
        new THREE.Vector3(
          x * latticeUnit,
          y * latticeUnit,
          z * latticeUnit,
        ),
    );
  }

  private positionCamera(): void {
    if (this.cellViews.length === 0) {
      this.camera.position.set(10, 10, 10);
      return;
    }

    const bounds = new THREE.Box3();

    for (const cellView of this.cellViews) {
      bounds.expandByObject(cellView.object);
    }

    const cluster = bounds.getBoundingSphere(new THREE.Sphere());
    const verticalFov = THREE.MathUtils.degToRad(this.camera.fov);
    const horizontalFov = 2 * Math.atan(
      Math.tan(verticalFov / 2) * this.camera.aspect,
    );
    const limitingFov = Math.min(verticalFov, horizontalFov);
    const distance = (cluster.radius / Math.sin(limitingFov / 2)) * 1.15;
    const viewingDirection = new THREE.Vector3(1.8, 0.8, 2.4).normalize();

    this.camera.position.copy(cluster.center).addScaledVector(
      viewingDirection,
      distance,
    );
    this.controls.target.copy(cluster.center);
    this.controls.update();
  }

  private resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private render(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
