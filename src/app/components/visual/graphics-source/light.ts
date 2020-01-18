import { Vector3 } from './geometry';

export class Light {
  constructor() {
    this.lightDirection = new Vector3(-1, -1, -1);
    this.ambientLight = 0.3;
  }

  lightDirection: Vector3;
  ambientLight: number;

  use (shaderProgram) {
    const dir = this.lightDirection;
    const gl = shaderProgram.gl;
    gl.uniform3f(shaderProgram.lightDirection, dir.x, dir.y, dir.z);
    gl.uniform1f(shaderProgram.ambientLight, this.ambientLight);
  }
}
