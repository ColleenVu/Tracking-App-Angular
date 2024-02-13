import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PeopleServiceService } from '../people-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];

  constructor(private ps: PeopleServiceService) {
  }

  ngOnInit(): void {
    this.showMap();

    const initialMarkerData = this.ps.markerCurr;
    if (initialMarkerData.length > 0) {
      this.addMarkers(initialMarkerData);
    }

    this.ps.markerNew.subscribe((markerCurr) => {
      this.updateMarkers(markerCurr);
    });

    this.ps.peopleNew.subscribe((people) => {
      this.removeMarkers();
      this.addMarkers(this.ps.markerCurr);
    });
  }

  showMap() {
    this.map = L.map('mapid').setView([49.27, -123], 11);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  onMapClick(e: L.LeafletMouseEvent) {
    const popup = L.popup()
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(this.map);
  }

  addMarker(latlng: L.LatLng) {
    const customIcon = L.icon({
      iconUrl: 'https://png2.cleanpng.com/sh/363ecdc6181e7757eb2bdc89022350c6/L0KzQYm3VMIzN5JxiZH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6Tfdwd5hxfZ92YYD2Pbj2jBdtbV5yeeI2bXHudcO0gBVvfJZ3RehuY4Tygn68gfRkbGVmTqY6OEa0Q3A3VMk4OWg4SaMAMkS3QoKAWcgzPmk5RuJ3Zx==/kisspng-computer-icons-google-maps-google-map-maker-center-vector-5adcd4a6418613.0497173115244217982684.png', // or '/marker.png'
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    const marker = L.marker(latlng, { icon: customIcon }).addTo(this.map);
    const numberOfReports = this.numReports(latlng);
    marker.bindPopup(`${numberOfReports} nuisance report(s)`);
    this.markers.push(marker);
  }

  addMarkers(markerDataArray: { latitude: number; longitude: number }[]) {
    markerDataArray.forEach(markerCurr => {
      const { latitude, longitude } = markerCurr;
      this.addMarker(L.latLng(latitude, longitude));
    });
  }

  updateMarkers(markerDataArray: { latitude: number; longitude: number }[]) {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    this.addMarkers(markerDataArray);
  }

  removeMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  numReports(latlng: L.LatLng): number {
    const locationReports = this.ps.markerCurr.filter(data => 
    data.latitude === latlng.lat && data.longitude === latlng.lng);
    return locationReports.length;
  }
}
