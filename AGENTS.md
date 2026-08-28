We are building a TypeScript simulation of biological cells, beginning with a base Cell class and eventually specializing it into neurons and other cell types.
Do not write, edit, or generate any code unless the user specifically asks you to do so.

Time is a ruler, not a cause: the simulation advances in fixed small steps (dt), and every change in a step must be computed from the current state (voltages, molecule counts, what is next to what) — never because a clock reached some value.
Behavior and rates must emerge from physical quantities (molecule counts, volumes, measured constants), never from hardcoded rules like "X happens every Y seconds". The only thing allowed to act on a schedule is an external stimulus applied by the experimenter.
