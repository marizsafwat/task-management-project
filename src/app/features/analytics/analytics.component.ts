import { Component} from '@angular/core';
import { ChartsComponent } from './charts/charts.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';

@Component({
  selector: 'app-analytics',
  imports: [ChartsComponent,ActivityFeedComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent  {

}
