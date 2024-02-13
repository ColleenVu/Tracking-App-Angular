import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleServiceService } from '../people-service.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.css']
})
export class PersonViewComponent implements OnInit {
  @Input() person: any;
  pname: string = '';
  plocation: string = '';
  pyourname: string = '';
  pcontactnumber: string = '';
  pstatus: string = '';
  padded_on: Date | null = null;
  pmoreinfo: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private ps: PeopleServiceService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const personId = +params['id'];
      this.person = this.ps.getPersonById(personId);
      this.updateProperties();
    });
  }

  private updateProperties() {
    this.pname = this.person?.name || '';
    this.plocation = this.person?.location || '';
    this.pyourname = this.person?.yourname || '';
    this.pcontactnumber = this.person?.contactnumber || '';
    this.pstatus = this.person?.status || '';
    this.padded_on = this.person?.added_on || null;
    this.pmoreinfo = this.person?.extrainfo || '';
  }

  async changeStatus() {
    const password = prompt('Enter password to change status to resolved:');
    if (password !== null) {
      const hashedPassword = await this.hashPassword(password);
      if (hashedPassword !== null && hashedPassword === 'fcab0453879a2b2281bc5073e3f5fe54') {
        this.person.status = 'resolved';
        this.updateProperties(); 
      } else {
        alert('Invalid password');
      }
    } else {
      alert('Invalid password');
    }
  }

  private async hashPassword(password: string): Promise<string | null> {
    const url = `https://api.hashify.net/hash/md5/hex?value=${password}`;
    try {
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData.Digest || null;
    } catch (error) {
      console.error('Error', error);
      return null;
    }
  }

  goBack() {
    this.router.navigate(['/people']); 
  }
}
