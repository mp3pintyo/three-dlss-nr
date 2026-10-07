# Upstream integration — 2026-10-07

Selected changes are adapted from Ben Houston's MIT-licensed
[three-dlss-nr at caaf519](https://github.com/bhouston/three-dlss-nr/tree/caaf519ff0c8c872a6d7c02d73b5509b14276651).
The pinned OpenDLSS-NR submodule remains unchanged. Existing LICENSE and NOTICE attribution applies.

## Imported and adapted changes

- `46b814a`: ownership tracking, partial-load cleanup, late arrivals and same-ID model-load races; adapted to our `DemoModel` / `loadModel` names and retained registry.
- `171b44d`: current-network readiness, canceled waits, stale weight uploads and controller disposal.
- `4eaacfc`: reference program cache descriptors are copied before asynchronous preparation, with failure eviction and per-device isolation; includes unit and full-network rebuild tests.
- `a467251`: exact normal half publication with explicit control flow even when compiled inside a TSL `pick`; includes boundary and shader generation tests.
- `33cfb83`, `6e9d756`, `c630715`: equivalent explicit FP8 shared-memory slot formulas and stable shader snapshot ordering. The fork already used padded tiles; this is not a newly measured speedup.
- `86e9849`, `59c14da`: bounding-sphere camera fitting and draining orbit damping on reset, adapted to our existing scene camera directions and environment intensities.
- `358d5f5`: serialize full-network GPU files to avoid competing for the same GPU.

The upstream model bundles and model preparation/validation tooling are outside this patch.
The fork keeps its five original assets and IDs, source/license files, Hungarian explainer and backend help,
local Windows launchers, private-runtime exclusions and fork-only bilingual GitHub release workflow.

## Validation

Required gates are the frozen install, build, type checking, lint, formatting, unit tests, GPU tests,
release tooling, bundle size and committed fidelity results. Rendered QA covers retained model switching,
rapid repeat selection, camera reset, narrow viewport fitting, recoverable load failure/retry and the Hungarian presentation.
GPU parity demonstrates correctness; performance measurements are separate and no new throughput claim is made.
