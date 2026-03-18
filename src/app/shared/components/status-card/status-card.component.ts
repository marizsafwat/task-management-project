import { Component, input, output, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Task } from '../../interfaces/task.interface';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskStatus } from '../../types/task-status.type';

@Component({
  selector: 'app-status-card',
  imports: [MatCardModule,TaskCardComponent],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.css'
})
export class StatusCardComponent {
  data=input<Task[]>();
  listId = input<string>('');
  connectedTo = input<string[]>([]);
  taskDropped = output<{ task: Task; newStatus: TaskStatus }>();
}
