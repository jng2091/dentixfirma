import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  enableDoctor = false;
  enablePdf = false;
  constructor(public dataService: DataService) {

   

    this.dataService.obtenerCatalogo().subscribe(data => {

      this.dataService.objCatalogo = data;
      if (data.roles.indexOf(8) != -1) {
        this.enableDoctor = true;
      }
      else {
        this.enableDoctor = false;
      }

      if (data.roles.indexOf(7) != -1) {
        this.enablePdf = true;
      }
      else {
        this.enablePdf = false;
      }

    });

    // this.dataService.objSolicitud.subscribe(data => {
    //   if (data) {
    //     console.log(data.roles)
    //     if (data.roles.indexOf(8) != -1) {
    //       this.enableDoctor = true;
    //     }
    //     else{
    //       this.enableDoctor = false;
    //     }
    //   }
    // });


  }

  ngOnInit() {
  }


}


@Component({
  selector: 'firma-dialog',
  templateUrl: 'firma-dialog.html',
  styleUrls: ['./home.component.css']
})

export class FirmaDialog {

  constructor(
    public dialogRef: MatDialogRef<FirmaDialog>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = window.innerWidth / 1.1;
  @Input() public height = window.innerHeight / 2;


  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.width = window.innerWidth / 1.1;
    this.height = window.innerHeight / 2;

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;
  }

  private cx: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
    this.captureEvents2(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }



  private captureEvents2(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          e.preventDefault();
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)

              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].touches[0].clientX - rect.left,
          y: res[0].touches[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].touches[0].clientX - rect.left,
          y: res[1].touches[0].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  limpiarCanvas() {
    this.cx.clearRect(0, 0, this.width, this.height);
    this.data = null;
  }

  guardarCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.data = canvasEl.toDataURL("image/png");
    this.dialogRef.close(this.data);
  }
}
