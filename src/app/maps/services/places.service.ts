import { Injectable, inject } from '@angular/core';

import { PlacesApiClient } from '../api/placesApiClient';

import { environment } from 'src/environments/environments';

import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private placesApi = inject(PlacesApiClient);

  private mapsService = inject(MapService);

  public userLocation?: [number, number];

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor() {
    this.getUserLocation();
  }

  async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert('No se pudo obtener la geolocalización');
          console.error(err);
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }
    if (!this.userLocation) throw Error('No hay localización de usuario');

    this.isLoadingPlaces = true;

    this.placesApi
      .get<PlacesResponse>(`/${query}.json`, {
        params: {
          proximity: this.userLocation.join(','),
        },
      })
      .subscribe((response) => {
        this.isLoadingPlaces = false;
        this.places = response.features;

        this.mapsService.createMarkersFromPlaces(
          this.places,
          this.userLocation!
        );
      });
  }

  deletePlaces() {
    this.places = [];
  }
}
