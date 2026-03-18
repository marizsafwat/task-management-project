import { Statistic } from "./statistic.interface";


export interface StatisticsResponse {
  statistics: Statistic[];
  lastUpdated: string;
}