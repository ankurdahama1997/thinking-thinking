import { Cell } from './Cell';
import { Environment } from './Environment';
import { EnvironmentView } from './visualization/EnvironmentView';
import './styles.css';

function createEnvironment(cellCount: number): Environment {
  if (!Number.isInteger(cellCount) || cellCount < 0) {
    throw new Error('Cell count must be a non-negative integer.');
  }

  const environment = new Environment(10_000);

  for (let index = 0; index < cellCount; index += 1) {
    environment.addCell(new Cell(`cell-${index + 1}`, 500, 300));
  }

  return environment;
}

const environment = createEnvironment(30);
const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Could not find the app element.');
}

app.innerHTML = `
  <main>
    <div id="environment-scene" aria-label="Interactive three-dimensional cellular environment"></div>
    <section class="scene-label">
      <h1>Thinking Thinking</h1>
      <p>${environment.cells.length} cells · drag to rotate · scroll to zoom</p>
    </section>
  </main>
`;

const sceneContainer = document.querySelector<HTMLDivElement>(
  '#environment-scene',
);

if (!sceneContainer) {
  throw new Error('Could not find the scene element.');
}

new EnvironmentView(sceneContainer, environment);
