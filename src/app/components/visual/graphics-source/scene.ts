import { Renderer } from './renderer';
import { Camera } from './camera';
import { Light } from './light';
import { Mesh } from './mesh';
import { ShaderProgram } from './material';
import { Geometry, Vector2, Vector3, Face, Vertex } from './geometry';
import { Texture } from './texture';

export class Scene {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.gl = this.renderer.getContext();
    this.objects = [];
    this.camera = new Camera();
    this.camera.setOrthographic(16, 10, 10);
    this.light = new Light();
  }

  gl: WebGLRenderingContext;
  renderer: Renderer;
  camera: Camera;
  light: Light;
  objects: Mesh[];

  // Loads shader files from the given URLs, and returns a program as a promise
  loadShader(vertUrl, fragUrl) {
    return Promise.all([loadFile(vertUrl), loadFile(fragUrl)]).then((files) => {
      return new ShaderProgram(this.gl, files[0], files[1]);
    });
    function loadFile (url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            resolve(xhr.responseText);
          }
        };
        xhr.open('GET', url, true);
        xhr.send(null);
      });
    }
  }

  loadTexture(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve(new Texture(this.gl, image));
      };
      image.src = url;
    });
  }

  // Parses an OBJ file, passed as a string
  parseOBJ(src): Geometry {
    const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
    const NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
    const UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
    const FACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/;
    const lines = src.split('\n');
    const positions = [];
    const uvs = [];
    const normals = [];
    const faces = [];
    lines.forEach(function (line) {
      // Match each line of the file against constious RegEx-es
      let result;
      if ((result = POSITION.exec(line)) != null) {
        // Add new vertex position
        positions.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
      } else if ((result = NORMAL.exec(line)) != null) {
        // Add new vertex normal
        normals.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
      } else if ((result = UV.exec(line)) != null) {
        // Add new texture mapping point
        uvs.push(new Vector2(parseFloat(result[1]), 1 - parseFloat(result[2])));
      } else if ((result = FACE.exec(line)) != null) {
        // Add new face
        const vertices = [];
        // Create three vertices from the passed one-indexed indices
        for (let i = 1; i < 10; i += 3) {
          const part = result.slice(i, i + 3);
          const position = positions[parseInt(part[0], 10) - 1];
          const uv = uvs[parseInt(part[1], 10) - 1];
          const normal = normals[parseInt(part[2], 10) - 1];
          vertices.push(new Vertex(position, normal, uv));
        }
        faces.push(new Face(vertices));
      }
    });
    return new Geometry(faces);
  }

  loadGeometryFromOBJ(url) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve(this.parseOBJ(xhr.responseText));
        }
      };
      xhr.open('GET', url, true);
      xhr.send(null);
    });
  }

  loadMesh(parameters) {
    const geometry = this.loadGeometryFromOBJ(parameters[4]);
    const texture = this.loadTexture(parameters[5]);
    return Promise.all([geometry, texture]).then((params) => {
      const mesh = new Mesh(this.gl, params[0], params[1]);
      mesh.position = mesh.position.translate(parseFloat(parameters[0]), parseFloat(parameters[1]), parseFloat(parameters[2]));
      mesh.isHull = parseInt(parameters[3]) === 1;
      return mesh;
    });
  }

  parsePlacement(src) {
    const lines = src.split('\n');
    const objects: Mesh[] = [];
    lines.forEach((line) => {
      const result = line.split(' ');
      if (line !== '') {
        this.loadMesh(result).then((mesh) => {
          this.objects.push(mesh);
        });
      }
    });
  }

  loadFromPlacement(url: string) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          this.parsePlacement(xhr.responseText);
        }
      };
      xhr.open('GET', url, true);
      xhr.send(null);
    });
  }

  loadPlacement(url: string) {
    const objects = this.loadFromPlacement(url);
    return Promise.all([objects]).then((params) => {
      return params[0];
    });
  }
}
