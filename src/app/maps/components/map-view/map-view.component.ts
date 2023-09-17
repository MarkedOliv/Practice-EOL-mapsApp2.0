import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { PlacesService } from '../../services';

import { Map } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  public mapDivElement!: ElementRef;

  private placesService = inject(PlacesService);

  ngAfterViewInit(): void {
    console.log(this.placesService.userLocation);

    if (!this.placesService.userLocation) throw new Error('No hay localización');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.placesService.userLocation,
      zoom: 10,
    });
  }
}
