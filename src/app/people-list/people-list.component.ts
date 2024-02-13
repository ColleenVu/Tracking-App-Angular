import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../people-service.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})

export class PeopleListComponent implements OnInit {
  people: any[];
  query: string;

  constructor(private ps: PeopleServiceService) {
    this.query = '';
    this.people = [];
  }

  onPersonDelete(evt: { person_id: number }) {
    const del_per_id = evt.person_id;
    this.people = this.ps.delete(del_per_id);
  }

  sortTable(column: string): void {
    this.people.sort((a, b) => {
      if (column === 'location') {
        return a.location.localeCompare(b.location);
      } else if (column === 'name') {
        return a.name.localeCompare(b.name);
      } else if (column === 'time') {
        return (this.ps.getTimeForPerson(a.name) ?? 0) - (this.ps.getTimeForPerson(b.name) ?? 0);
      } else {
        return 0; 
      }
    });
  }

  ngOnInit(): void {
    this.people = this.ps.get();
  }
}
