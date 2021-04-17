import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  rangeInput = new FormControl(this.zoomLevel);
  center: [number, number] = [-74.06575124732214, 4.631025802834161];

  constructor() { }

  ngOnDestroy(){
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', (e)=>{
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', () => {
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }
    });

    this.mapa.on('move', (event)=>{
      const { lng, lat } = event.target.getCenter();
      this.center = [lng, lat];
    })

    this.rangeInput.valueChanges.subscribe(value => {
      this.mapa.zoomTo(value);
    });
  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

}
