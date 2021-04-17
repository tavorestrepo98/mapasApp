import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  rangeInput = new FormControl(this.zoomLevel);
  center: [number, number] = [-74.06575124732214, 4.631025802834161];

  //Arreglos de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngOnDestroy(){
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    /* const marker = new mapboxgl.Marker()
    .setLngLat(this.center)
    .addTo(this.mapa); */

    this.rangeInput.valueChanges.subscribe(value => {
      this.mapa.zoomTo(value);
    });

    this.leerLocalStorage();
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa)

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();
    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marcador: mapboxgl.Marker){

    const { lng, lat } = marcador.getLngLat();

    this.mapa.flyTo({
      center: [lng, lat]
    });
  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: MarcadorColor[]=[];

    this.marcadores.forEach(m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      lngLatArr.push({
        color,
        centro: [lng, lat]
      });

    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))

  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    lngLatArr.forEach(m => {
      const nuevoMarcador = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
      .setLngLat(m.centro)
      .addTo(this.mapa)

      this.marcadores.push({
        color: m.color,
        marker: nuevoMarcador
      });

      nuevoMarcador.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

    });

  }

  borrarMarcador(i: number){
    this.marcadores[i].marker.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
