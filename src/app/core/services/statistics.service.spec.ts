import { TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { StatisticsResponse } from '../../shared/interfaces/statistics-response.interface';

const mockStatisticsResponse: StatisticsResponse = {
  lastUpdated: new Date().toISOString(),
  statistics: [
    {
      id: '1',
      title: 'Total Tasks',
      value: 42,
      icon: 'task',
      color: '#6200ee',
      change: '+5',
      changeLabel: 'since last week',
      changeType: 'positive'
    },
    {
      id: '2',
      title: 'Completed',
      value: 18,
      icon: 'check_circle',
      color: '#00c853',
      change: '+3',
      changeLabel: 'since last week',
      changeType: 'positive'
    },
    {
      id: '3',
      title: 'Overdue',
      value: 5,
      icon: 'warning',
      color: '#d50000',
      change: '-2',
      changeLabel: 'since last week',
      changeType: 'negative'
    },
    {
      id: '4',
      title: 'In Progress',
      value: 10,
      icon: 'pending',
      color: '#ff6d00',
      change: '0',
      changeLabel: 'no change',
      changeType: 'neutral'
    }
  ]
};

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch statistics from assets/statistics.json', () => {
    service.getStatistics().subscribe(res => {
      expect(res).toEqual(mockStatisticsResponse);
    });

    const req = httpMock.expectOne('assets/statistics.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockStatisticsResponse);
  });

  it('should return statistics array with correct length', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics.length).toBe(4);
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return correct statistic titles', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics[0].title).toBe('Total Tasks');
      expect(res.statistics[1].title).toBe('Completed');
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return correct statistic values', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics[0].value).toBe(42);
      expect(res.statistics[1].value).toBe(18);
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return correct changeType values', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics[0].changeType).toBe('positive');
      expect(res.statistics[2].changeType).toBe('negative');
      expect(res.statistics[3].changeType).toBe('neutral');
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return lastUpdated field', () => {
    service.getStatistics().subscribe(res => {
      expect(res.lastUpdated).toBeTruthy();
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return correct statistic ids', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics[0].id).toBe('1');
      expect(res.statistics[1].id).toBe('2');
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should return correct icons', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics[0].icon).toBe('task');
      expect(res.statistics[1].icon).toBe('check_circle');
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush(mockStatisticsResponse);
  });

  it('should handle empty statistics array', () => {
    service.getStatistics().subscribe(res => {
      expect(res.statistics.length).toBe(0);
    });

    const req = httpMock.expectOne('assets/statistics.json');
    req.flush({ statistics: [], lastUpdated: new Date().toISOString() });
  });

  it('should use GET method', () => {
    service.getStatistics().subscribe();

    const req = httpMock.expectOne('assets/statistics.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockStatisticsResponse);
  });
});