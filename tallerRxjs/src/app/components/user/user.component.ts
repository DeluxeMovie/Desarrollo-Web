import { Component, Input } from '@angular/core';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html'
})
export class UserComponent {
  @Input() user!: User;
}