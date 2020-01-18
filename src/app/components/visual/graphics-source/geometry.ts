export class Geometry {
  constructor(faces) {
    this.faces = faces || [];
  }
  faces: any;

  vertexCount(): number {
    return this.faces.length * 3;
  }

  positions() {
    const answer = [];
    this.faces.forEach(function (face) {
      face.vertices.forEach(function (vertex) {
        const v = vertex.position;
        answer.push(v.x, v.y, v.z);
      });
    });
    return answer;
  }

  normals() {
    const answer = [];
    this.faces.forEach(function (face) {
      face.vertices.forEach(function (vertex) {
        const v = vertex.normal;
        answer.push(v.x, v.y, v.z);
      });
    });
    return answer;
  }

  uvs() {
    const answer = [];
    this.faces.forEach(function (face) {
      face.vertices.forEach(function (vertex) {
        const v = vertex.uv;
        answer.push(v.x, v.y);
      });
    });
    return answer;
  }
}

export class Face {
  constructor(vertices) {
    this.vertices = vertices || [];
  }
  vertices: any;
}

export class Vertex {
  constructor(position, normal, uv) {
    this.position = position;
    this.normal = normal;
    this.uv = uv;
  }
  position: Vector3;
  normal: Vector3;
  uv: Vector2;
}

export class Vector3 {
  constructor(x, y, z) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.z = Number(z) || 0;
  }
  x: number;
  y: number;
  z: number;
}

export class Vector2 {
  constructor(x, y) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
  }
  x: number;
  y: number;
}
