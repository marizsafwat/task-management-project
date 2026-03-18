import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../shared/interfaces/task.interface';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
Chart.register(...registerables);
@Component({
  selector: 'app-charts',
  imports: [MatCardModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit{
@ViewChild('priorityChart') priorityChartRef!: ElementRef;
  @ViewChild('statusChart') statusChartRef!: ElementRef;

  tasksService = inject(TasksService);
  tasks = signal<Task[]>([]);

  priorityChart!: Chart;
  statusChart!: Chart;

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks.set(tasks??[]);
      setTimeout(() => {
        this.buildPriorityChart();
        this.buildStatusChart();
      }, 0);
    });
  }

  buildPriorityChart(): void {
    const tasks = this.tasks();
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    if (this.priorityChart) this.priorityChart.destroy();

    this.priorityChart = new Chart(this.priorityChartRef?.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          data: [high, medium, low],
          backgroundColor: ['#ef4444', '#f97316', '#22c55e'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 12 } }
          }
        },
        cutout: '65%'
      }
    });
  }

  buildStatusChart(): void {
    const tasks = this.tasks();
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    if (this.statusChart) this.statusChart.destroy();

    this.statusChart = new Chart(this.statusChartRef?.nativeElement, {
      type: 'bar',
      data: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
          label: 'Tasks',
          data: [todo, inProgress, done],
          backgroundColor: ['#93c5fd', '#fbbf24', '#34d399'],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#f3f4f6' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}
