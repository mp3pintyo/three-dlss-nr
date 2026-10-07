import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three/webgpu';

import { DemoController } from './demo';
import { DEFAULT_MODEL_ID } from './models';

const loads = vi.hoisted(() => ({ model: vi.fn() }));
vi.mock('./studio', () => ({ loadModel: loads.model, createStudio: vi.fn() }));

const model = () => ({ object: new THREE.Group(), dispose: vi.fn() });
const deferred = () => {
  let resolve!: (value: ReturnType<typeof model>) => void;
  const promise = new Promise<ReturnType<typeof model>>((done) => (resolve = done));
  return { promise, resolve };
};

const controller = () => {
  const demo: any = new DemoController();
  demo.studio = { stage: new THREE.Group(), scene: new THREE.Scene(), dispose: vi.fn() };
  demo.model = model();
  demo.studio.stage.add(demo.model.object);
  demo.pass = { resetHistory: vi.fn(), dispose: vi.fn() };
  return demo;
};

describe('model load races', () => {
  it('keeps a newer same-ID request pending when an older request rejects', async () => {
    const demo = controller();
    let reject!: (error: Error) => void;
    const older = new Promise<ReturnType<typeof model>>((_resolve, fail) => {
      reject = fail;
    });
    const newer = deferred();
    loads.model.mockReturnValueOnce(older).mockReturnValueOnce(newer.promise);
    const first = demo.setModel(DEFAULT_MODEL_ID);
    const second = demo.setModel(DEFAULT_MODEL_ID);
    reject(new Error('obsolete failure'));
    await first;
    expect(demo.getState().modelLoading).toBe(true);
    expect(demo.getState().requestedModelId).toBe(DEFAULT_MODEL_ID);
    expect(demo.getState().modelError).toBeNull();
    newer.resolve(model());
    await second;
    expect(demo.getState().modelLoading).toBe(false);
    expect(demo.getState().requestedModelId).toBeNull();
  });

  it('disposes a superseded same-ID load without replacing the current model', async () => {
    const demo = controller();
    const displayed = demo.model;
    const a = deferred();
    const b = deferred();
    loads.model.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise);
    const first = demo.setModel(DEFAULT_MODEL_ID);
    const second = demo.setModel(DEFAULT_MODEL_ID);
    const newest = model();
    b.resolve(newest);
    await second;
    expect(displayed.dispose).toHaveBeenCalledTimes(1);
    const stale = model();
    a.resolve(stale);
    await first;
    expect(stale.dispose).toHaveBeenCalledTimes(1);
    expect(newest.dispose).not.toHaveBeenCalled();
    expect(demo.model).toBe(newest);
    expect(demo.studio.stage.children).toEqual([newest.object]);
    expect(demo.pass.resetHistory).toHaveBeenCalledTimes(1);
  });

  it('keeps the displayed model alive on load failure', async () => {
    const demo = controller();
    const displayed = demo.model;
    loads.model.mockRejectedValueOnce(new Error('load failed'));
    await demo.setModel(DEFAULT_MODEL_ID);
    expect(demo.getState().modelId).toBe(DEFAULT_MODEL_ID);
    expect(demo.getState().requestedModelId).toBeNull();
    expect(demo.getState().modelError?.message).toContain('load failed');
    expect(demo.model).toBe(displayed);
    expect(displayed.dispose).not.toHaveBeenCalled();
    expect(demo.getState().modelLoading).toBe(false);
  });

  it('releases a late load after controller disposal and does not emit state updates', async () => {
    const demo = controller();
    const pending = deferred();
    loads.model.mockReturnValueOnce(pending.promise);
    const request = demo.setModel(DEFAULT_MODEL_ID);
    const listener = vi.fn();
    demo.subscribe(listener);
    demo.dispose();
    const late = model();
    pending.resolve(late);
    await request;
    expect(late.dispose).toHaveBeenCalledTimes(1);
    expect(listener).not.toHaveBeenCalled();
  });
});
