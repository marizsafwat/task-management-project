import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsResponse } from '../../shared/interfaces/statistics-response.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
 http=inject(HttpClient);

  constructor() { }

  // Method to fetch statistics data from the JSON file
  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>('assets/statistics.json');
  }
}
