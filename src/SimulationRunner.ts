import { Environment } from "./Environment";

// Floating-point noise can leave us a hair under a whole step (e.g. 99.9999999 instead of 100).
// A billionth of a step of tolerance is far below anything the model could notice.
const STEP_TOLERANCE = 1e-9;

export class SimulationRunner {
    public timeScale = 1; // simulated seconds per real second
    public pause = false;
    private pendingSteps = 0; // simulated time owed to the model, measured in steps (may be fractional)

    constructor(private environment: Environment, private readonly maxStepsPerAdvance = 10_000) { }

    public advance(realElapsedSeconds: number): void {
        if (this.pause) return;
        this.pendingSteps += (realElapsedSeconds * this.timeScale) / this.environment.dtSeconds;

        const wholeSteps = Math.floor(this.pendingSteps + STEP_TOLERANCE);
        const steps = Math.min(wholeSteps, this.maxStepsPerAdvance);

        for (let i = 0; i < steps; i += 1) {
            this.environment.step();
        }

        this.pendingSteps = wholeSteps > this.maxStepsPerAdvance
            ? 0 // fell behind; drop the backlog instead of trying to catch up forever
            : this.pendingSteps - steps;
    }

    public stepOnce(): void {
        this.environment.step()
    }
}
