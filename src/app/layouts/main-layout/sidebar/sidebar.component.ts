import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TaskFormDialogComponent } from '../../../shared/components/task-form-dialog/task-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskBtnComponent } from "../../../shared/components/add-task-btn/add-task-btn.component";
@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule,
    MatButtonModule,
    MatIconModule, RouterModule, AddTaskBtnComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
