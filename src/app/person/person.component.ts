import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  @Input() person: any;
  @Output() delete = new EventEmitter();

  constructor(private router: Router) { }

  async onDelete(evt: any, person_id: number) {
    evt["person_id"] = person_id;
    const password = prompt('Enter password to delete:');
    if (password !== null) {
      this.hashPassword(password).then((hashedPassword: string | null) => {
        if (hashedPassword !== null && hashedPassword === 'fcab0453879a2b2281bc5073e3f5fe54') {
          this.delete.emit(evt);
        } else {
          alert('Invalid password');
        }
      });
    } else {
      alert('Invalid password');
    }
  }

  onView() {
    this.router.navigate(['/person', this.person.id]);
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
}
