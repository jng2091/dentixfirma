import {
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule,
    MatInputModule, MatTabsModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatBadgeModule, MatTooltipModule,
    MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatDialogModule,MatDividerModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule,
        MatInputModule, MatTabsModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatBadgeModule, MatTooltipModule,
        MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatDialogModule,MatDividerModule
    ],
    exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule,
        MatInputModule, MatTabsModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatBadgeModule, MatTooltipModule,
        MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatDialogModule,MatDividerModule
    ]
})
export class MaterialModule { }