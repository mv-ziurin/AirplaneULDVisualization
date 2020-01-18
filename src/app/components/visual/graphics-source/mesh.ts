import { Transformation } from './transformation';
import { Geometry } from './geometry';
import { Texture } from './texture';
import { VBO } from './vbo';

export class Mesh {
  constructor(gl, geometry, texture) {
    const vertexCount = geometry.vertexCount();
    this.positions = new VBO(gl, geometry.positions(), vertexCount);
    this.normals = new VBO(gl, geometry.normals(), vertexCount);
    this.uvs = new VBO(gl, geometry.uvs(), vertexCount);
    this.texture = texture;
    this.vertexCount = vertexCount;
    this.position = new Transformation();
    this.gl = gl;
    this.isVisible = true;
    this.isHull = false;
  }

  positions: VBO;
  normals: VBO;
  uvs: VBO;
  texture: Texture;
  vertexCount: number;
  position: Transformation;
  gl;
  geometry: Geometry;
  isVisible: boolean;
  isHull: boolean;

  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  draw(shaderProgram) {
    this.positions.bindToAttribute(shaderProgram.position);
    this.normals.bindToAttribute(shaderProgram.normal);
    this.uvs.bindToAttribute(shaderProgram.uv);
    this.position.sendToGpu(this.gl, shaderProgram.model, false);
    this.texture.use(shaderProgram.diffuse, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }
}
