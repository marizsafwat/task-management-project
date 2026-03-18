import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
data = inject(MAT_DIALOG_DATA);
dialogRef=inject(MatDialogRef<ConfirmationDialogComponent>);
  // constructor(
  //   public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  // ) {}

  onClick(result: boolean,event: MouseEvent): void {
      (event.target as HTMLElement).blur();
    this.dialogRef.close(result);
  }
}
