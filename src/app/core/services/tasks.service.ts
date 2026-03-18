import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
import { TasksResponse } from '../../shared/interfaces/tasks-response.interface';
import { Task } from '../../shared/interfaces/task.interface';
import { Assignee } from '../../shared/interfaces/assignee.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  http = inject(HttpClient);
  constructor() {}

  // Using ReplaySubject to hold the latest filtered task
  private searchTerm$ = new ReplaySubject<any>(1);
  // Using BehaviorSubject to hold the list of tasks, initialized with null
  private tasks$ = new BehaviorSubject<Task[] | null>(null);
  // Method to fetch all tasks from the JSON file and if already fetched, return the cached version
  getTasks(): Observable<Task[] | null> {
    if (this.tasks$.getValue() !== null) {
      return this.tasks$.asObservable(); // return cached version
    }

    return this.http.get<TasksResponse>('assets/tasks.json').pipe(
      map((res) => res.tasks),
      tap((tasks) => this.tasks$.next(tasks)),
    );
  }

  // Method to set the filtered task
  setFilteredTask(task: Task) {
    this.searchTerm$.next(task);
  }

  // Method to get the filtered task as an observable
  getFilteredTask(): Observable<Task> {
    return this.searchTerm$.asObservable();
  }

  // Method to add a new task to the list
  addTask(task: Task): Observable<Task[] | null> {
    const current = this.tasks$.getValue();
    this.tasks$.next([...(current ?? []), task]);
    return this.tasks$.asObservable();
    
  }

  // Method to update a task in the list
  updateTask(updated: Task): Observable<Task[] | null> {
    const current = this.tasks$.getValue();
    this.tasks$.next(current!.map((t) => (t.id === updated.id ? updated : t)));
    return this.tasks$.asObservable();
  }

  // Method to delete a task from the list
  deleteTask(id: string): Observable<string> {
    const current = this.tasks$.getValue();
    this.tasks$.next(current!.filter((t) => t.id !== id));
    return new Observable((observer) => {
      observer.next(id);
      observer.complete();
    });
  }
  getAssigneesFromTasks(): Observable<Assignee[]> {
    return this.getTasks().pipe(
      map((tasks) => {
        if (tasks === null) {
          return [];
        }
        const assignees = tasks.map((task) => task.assignee);
        return Array.from(new Set(assignees)); // Return unique assignees
      }),
    );  
  }
}
