export class Renderer {
  constructor(canvas) {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      gl.enable(gl.DEPTH_TEST);
      this.gl = gl;
      this.shader = null;
  }

  gl: any;
  shader: any;

  setClearColor(red, green, blue) {
    this.gl.clearColor(red / 255, green / 255, blue / 255, 1);
  }

  getContext() {
    return this.gl;
  }

  setShader(shader) {
    this.shader = shader;
  }

  render(camera, light, objects) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const shader = this.shader;
    if (!shader) {
      return;
    }
    shader.use();
    light.use(shader);
    camera.use(shader);
    objects.forEach(function (mesh) {
      if (!!mesh.isVisible) {
        mesh.draw(shader);
      }
    });
  }
}
