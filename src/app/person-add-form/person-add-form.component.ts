import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleServiceService } from '../people-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-add-form',
  templateUrl: './person-add-form.component.html',
  styleUrls: ['./person-add-form.component.css']
})

export class PersonAddFormComponent {
  form: FormGroup;
  locations: { name: string, latitude: number, longitude: number }[] = [];
  @Output() addMarker: EventEmitter<{ latitude: number; longitude: number }> = new EventEmitter();

  constructor(private ps: PeopleServiceService, private router: Router) {
    let formControls = {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      yourname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      contactnumber: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      extrainfo: new FormControl(),
      image: new FormControl(),
      status: new FormControl(
        'open',
        Validators.required
      ),
      longitude: new FormControl('', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)
      ]),
      latitude: new FormControl('', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)
      ]),
      locationName: new FormControl('', [
        Validators.required
      ]),
      location: new FormControl(''),
      newLocation: new FormControl(false)
    };
    this.form = new FormGroup(formControls, { validators:[]});
    this.locations = this.ps.getLocations();
  }

  onSubmit(newPerson: any) {
    const lat = this.form.get('latitude');
    const long = this.form.get('longitude');
    const locat = this.form.get('location');

    if (lat && long && locat) {
      const latitude = lat.value;
      const longitude = long.value;

      if (newPerson.newLocation) {
        const newLocation = {
          name: `${newPerson.locationName}, (${newPerson.latitude}, ${newPerson.longitude})`,
          latitude: newPerson.latitude,
          longitude: newPerson.longitude
        };

        newPerson.location = newLocation.name;
        const currLocation = this.locations.find(loc => loc.latitude === newLocation.latitude && loc.longitude === newLocation.longitude);

        if (!currLocation) {
          this.locations.push(newLocation);
        }

        locat.setValue(newLocation.name, { emitEvent: false });
      }
      this.ps.add(newPerson);
      this.ps.initializeMarker({ latitude, longitude });
      this.router.navigate(['/people']);
    }
  }

  populate(locationName: string) {
    const selectedLocation = this.locations.find(loc => loc.name === locationName);

    if (selectedLocation) {
      this.form.patchValue({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName: locationName,
        newLocation: false
      });
    }
  }
}
