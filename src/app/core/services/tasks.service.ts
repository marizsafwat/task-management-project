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
import { ActivityService } from './activity.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  http = inject(HttpClient);
  activityService = inject(ActivityService);
  constructor() {}

  private searchTerm$ = new BehaviorSubject<Task | null>(null);
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
  setFilteredTask(task: Task|null) {
    debugger
    //this.searchTerm$.next(''); // Clear previous value
    this.searchTerm$.next(task);
  }

  // Method to get the filtered task as an observable
  getFilteredTask(): Task | null {
    debugger
    return this.searchTerm$.getValue();
  }

  // Method to add a new task to the list
  addTask(task: Task): Observable<Task[] | null> {
    const current = this.tasks$.getValue();
    this.tasks$.next([...(current ?? []), task]);
    this.activityService.log('created', task);
    return this.tasks$.asObservable();
    
  }

  // Method to update a task in the list
  updateTask(updated: Task): Observable<Task[] | null> {
    const current = this.tasks$.getValue()??[];
    const old = current.find(t => t.id === updated.id);
    this.tasks$.next(current!.map((t) => (t.id === updated.id ? updated : t)));
    if (old?.status !== updated.status) {
    this.activityService.log('status_changed', updated, updated.status);
  } else {
    this.activityService.log('updated', updated);
  }
    return this.tasks$.asObservable();
  }

  // Method to delete a task from the list
  deleteTask(id: string): Observable<string> {
    const current = this.tasks$.getValue()??[];
     const task = current.find(t => t.id === id)!;
    this.tasks$.next(current!.filter((t) => t.id !== id));
    this.activityService.log('deleted', task);
    return new Observable((observer) => {
      observer.next(id);
      observer.complete();
    });
  }
  getAssigneesFromTasks(): Observable<Assignee[]> {
  return this.getTasks().pipe(
    map((tasks) => {
      if (!tasks) return [];
      const map = new Map<string, Assignee>();
      tasks.forEach(task => map.set(task.assignee.id, task.assignee));
      return Array.from(map.values());
    })
  );
}
}
