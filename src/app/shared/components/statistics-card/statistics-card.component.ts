import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";
import { Statistic } from '../../interfaces/statistic.interface';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-statistics-card',
  imports: [MatCardModule, MatIcon, NgStyle],
  templateUrl: './statistics-card.component.html',
  styleUrl: './statistics-card.component.css'
})
export class StatisticsCardComponent {
  statistic=input<Statistic>();
  // icon=input<string>();
  // header=input<string>();
  // content=input<number>();
  // status=input<string>();
}
