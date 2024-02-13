import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PeopleServiceService {
  people: any[];
  markerCurr: { latitude: number; longitude: number }[] = [];
  markerNew: EventEmitter<{ latitude: number; longitude: number }[]> = new EventEmitter<{ latitude: number; longitude: number }[]>();
  peopleNew: EventEmitter<any[]> = new EventEmitter<any[]>();
  locations: { name: string, latitude: number, longitude: number }[] = [];
  private p_id: number = 0;

  constructor() {
    this.people = [];
  }

  private generatePersonId(): number {
    return ++this.p_id;
  }

  get() {
    return this.people;
  }

  add(newPerson: any) {
    newPerson.id = this.generatePersonId();
    newPerson.added_on = new Date().getTime();
    this.people.push(newPerson);
    const { latitude, longitude } = newPerson;
    this.markerCurr.push({ latitude, longitude });
    this.peopleNew.emit(this.people);
    this.markerNew.emit(this.markerCurr);
  }

  delete(personId: number) {
    const personToDelete = this.people.findIndex(p => p.id === personId);
    if (personToDelete !== -1) {
      const deletedPerson = this.people.splice(personToDelete, 1)[0];
      const { latitude, longitude } = deletedPerson;
      const locationReports = this.markerCurr.filter(marker => marker.latitude === latitude && marker.longitude === longitude);
      if (locationReports.length > 1) {
        const reportIndex = this.markerCurr.findIndex(marker => marker.latitude === latitude && marker.longitude === longitude);
        this.markerCurr.splice(reportIndex, 1);
      } else {
        this.markerCurr = this.markerCurr.filter(marker => !(marker.latitude === latitude && marker.longitude === longitude));
      }
      this.people = this.people.filter(p => p.id !== personId);
      this.markerNew.emit(this.markerCurr);
      this.peopleNew.emit(this.people);
    }
    return this.people;
  }

  getPersonById(id: number): any {
    return this.people.find(person => person.id === id);
  }

  getPersonByName(name: string): any {
    return this.people.find(person => person.name === name);
  }

  getTimeForPerson(name: string): number | null {
    const person = this.getPersonByName(name);
    return person ? person.added_on : null;
  }

  private mpMark: { latitude: number; longitude: number } | null = null;

  initializeMarker(markerCurr: { latitude: number; longitude: number } | null) {
    this.mpMark = markerCurr;
    if (markerCurr) {
      const { latitude, longitude } = markerCurr;
      const existingLocation = this.locations.find(loc => loc.latitude === latitude && loc.longitude === longitude);
      if (!existingLocation) {
        this.locations.push({ name: `${latitude}, ${longitude}`, latitude, longitude });
      }
    }
  }

  getLocations(): { name: string, latitude: number, longitude: number }[] {
    return this.locations;
  }
}
