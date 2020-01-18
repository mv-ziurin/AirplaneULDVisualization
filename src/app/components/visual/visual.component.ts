import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Scene } from './graphics-source/scene';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})

export class VisualComponent implements OnInit {

  constructor() { }

  @ViewChild('canvas3D')
    canvas: ElementRef;

  scene: Scene;
  objectPlacements = [
    {value: environment.placementUrl[0], viewValue: 'Расстановка 1'},
    {value: environment.placementUrl[1], viewValue: 'Расстановка 2'},
  ];
  selectedPlacement: string;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;


  ngOnInit() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.scene = new Scene(this.canvas.nativeElement);
    this.scene.renderer.setClearColor(100, 149, 237);
    this.scene.loadShader(environment.vertexShaderUrl, environment.fragmentShaderUrl)
    .then((shader) => {
      this.scene.renderer.setShader(shader);
    });
    this.mouseX = 0;
    this.mouseY = 0;
    this.loop();
  }

  loop () {
    this.scene.renderer.render(this.scene.camera, this.scene.light, this.scene.objects);
    requestAnimationFrame(() => this.loop());
  }

  loadSceneObjects(e) {
    this.scene.renderer.setClearColor(100, 149, 237);
    this.scene.objects = [];
    this.scene.loadPlacement(this.selectedPlacement);
  }

  saveMouseCoords(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMouseDown = true;
  }

  releaseMouse(e) {
    this.isMouseDown = false;
  }

  moveCamera(e) {
    e.preventDefault();
    if (this.isMouseDown) {
      const deltaX = this.mouseX - e.clientX;
      const deltaY = this.mouseY - e.clientY;
      this.scene.camera.position = this.scene.camera.position.rotateY(0.05 * deltaX * Math.PI / 360);
      this.scene.camera.position = this.scene.camera.position.rotateX(0.05 * deltaY * Math.PI / 360);
    }
  }

  zoom(e) {
    const mouseX = e.clientX - this.canvas.nativeElement.offsetLeft;
    const mouseY = e.clientY - this.canvas.nativeElement.offsetTop;
    const wheel = e.wheelDelta / 120;
    const zoom = 1 + wheel / 2;
    this.scene.camera.position = this.scene.camera.position.scale(zoom, zoom, zoom);
  }

  toggleHull(e) {
    for(let i = 0; i < this.scene.objects.length; i++) {
      if(this.scene.objects[i].isHull) {
        this.scene.objects[i].isVisible = !this.scene.objects[i].isVisible;
      }
    }
  }

  onWindowResize(){
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }
}
