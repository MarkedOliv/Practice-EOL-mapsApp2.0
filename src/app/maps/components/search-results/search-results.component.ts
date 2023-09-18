import { Component, inject } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places.interface';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent {
  private placesService = inject(PlacesService);
  private mapService = inject(MapService);

  public selectedId: string = '';

  get isLoadingPlaces(): Boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    this.selectedId = place.id;
    const [lgn, lat] = place.center;

    this.mapService.flyTo([lgn, lat]);
  }

  getDirections(place: Feature) {
    if (!this.placesService.userLocation) throw Error('No hay localización de usuario');

    this.placesService.deletePlaces();

    const start = this.placesService.userLocation!;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);
  }
}
