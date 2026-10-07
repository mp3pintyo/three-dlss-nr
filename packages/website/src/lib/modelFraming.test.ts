import { describe, expect, it } from 'vitest';
import * as THREE from 'three/webgpu';
import { modelFitDistance } from './modelFraming';

describe('camera fitting for the retained local scenes', () => {
  it.each([16 / 9, 9 / 16, 1])('keeps the bounding sphere within the frustum at aspect %s', (aspect) => {
    const radius = 1.7;
    const camera = new THREE.PerspectiveCamera(26, aspect, 0.1, 100);
    camera.position.set(0, 0, modelFitDistance(radius, camera.fov, aspect));
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const frustum = new THREE.Frustum().setFromProjectionMatrix(matrix);
    for (const plane of frustum.planes) expect(plane.distanceToPoint(new THREE.Vector3())).toBeGreaterThan(radius);
  });

  it('backs out for narrow viewports and rejects invalid scene bounds', () => {
    expect(modelFitDistance(1.7, 26, 9 / 16)).toBeGreaterThan(modelFitDistance(1.7, 26, 16 / 9));
    expect(() => modelFitDistance(0, 26, 1)).toThrow(/invalid bounds/);
    expect(() => modelFitDistance(1, 26, 0)).toThrow(/invalid bounds/);
    expect(() => modelFitDistance(NaN, 26, 1)).toThrow(/invalid bounds/);
  });
});
