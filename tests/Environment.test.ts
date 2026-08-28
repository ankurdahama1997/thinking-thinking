import { expect, test } from "bun:test";
import { Cell } from "../src/Cell";
import { Environment } from "../src/Environment";
import { SimulationRunner } from "../src/SimulationRunner";

test("time starts at zero", () => {
    const environment = new Environment(10_000, 1e-5);
    expect(environment.timeSeconds()).toBe(0);
});

test("time advances by exactly dt per step", () => {
    const environment = new Environment(10_000, 1e-5);
    environment.addCell(new Cell("cell-1", 500, 300));

    for (let i = 0; i < 100_000; i += 1) {
        environment.step();
    }

    expect(environment.timeSeconds()).toBeCloseTo(1, 9);
});

test("runner turns real elapsed time into whole fixed steps", () => {
    const environment = new Environment(10_000, 1e-5);
    const runner = new SimulationRunner(environment);

    runner.advance(0.000_035); // 3.5 steps worth: run 3, keep the half for later
    expect(environment.timeSeconds()).toBeCloseTo(0.000_03, 12);

    runner.advance(0.000_005); // the leftover half plus this half makes one more step
    expect(environment.timeSeconds()).toBeCloseTo(0.000_04, 12);
});

test("runner honours timeScale and pause", () => {
    const environment = new Environment(10_000, 1e-5);
    const runner = new SimulationRunner(environment);

    runner.timeScale = 0.001;
    runner.advance(1); // one real second at 1000x slow motion = 1 simulated millisecond
    expect(environment.timeSeconds()).toBeCloseTo(0.001, 12);

    runner.pause = true;
    runner.advance(1);
    expect(environment.timeSeconds()).toBeCloseTo(0.001, 12);
});

test("runner drops the backlog instead of catching up forever", () => {
    const environment = new Environment(10_000, 1e-5);
    const runner = new SimulationRunner(environment, 100);

    runner.advance(60); // e.g. the tab was hidden for a minute
    expect(environment.timeSeconds()).toBeCloseTo(100 * 1e-5, 12);

    runner.advance(1e-5);
    expect(environment.timeSeconds()).toBeCloseTo(101 * 1e-5, 12);
});
