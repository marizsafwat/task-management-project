import { Component, computed, effect, inject, OnInit, output, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { Task } from '../../../shared/interfaces/task.interface';
import {  MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { TasksService } from '../../../core/services/tasks.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,
    MatButtonModule,MatInputModule,
    MatIconModule,ReactiveFormsModule,MatFormFieldModule,FormsModule,MatOptionModule,MatAutocompleteModule,
    CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{

taskService=inject(TasksService);
router=inject(Router);
tasks = signal<Task[]>([]);
debouncedSearchTerm = signal('');

searchTerm = signal('');
statusColors: Record<string, string> = {
  'todo': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-yellow-100 text-yellow-800',
  'done': 'bg-green-100 text-green-800'
};

filteredTasks = computed(() => {
  const term = this.debouncedSearchTerm().toLowerCase();
  return this.tasks().filter(
    t =>
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
  );
});

// Debounce effect

constructor(){
    effect(() => {
  const value = this.searchTerm();
  const timeout = setTimeout(() => {
    this.debouncedSearchTerm.set(value);
    this.taskService.getTasks().subscribe(res=>{
      //let tasksRes=res.tasks;
     this.tasks.update(tasks => [...(tasks??[]), ...(res??[])]);
    })
  }, 300); // 300ms debounce

  return () => clearTimeout(timeout);
});
}

selectTask(task: Task) {
  console.log('Selected task:', task);
  this.taskService.setFilteredTask(task);
  this.router.navigate(['/tasks', task.id]);
}
}
