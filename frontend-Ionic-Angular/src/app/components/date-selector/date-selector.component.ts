import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonDatetimeButton,
  IonModal
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonDatetimeButton,
    IonModal
  ]
})
export class DateSelectorComponent  implements OnInit {
  @Input() label: string = "";
  @Input() date?: Date = new Date();
  @Output() dateSelected = new EventEmitter<string>();
  selectedDate: string = new Date().toISOString();

  /** For multiple date-selectors */
  datetimeId = `datetime-${Math.random().toString(36).substring(2, 9)}`;

  constructor() { }

  ngOnInit() {
    if(this.date) {
      this.selectedDate = this.date.toISOString();
    }
    this.dateSelected.emit(this.selectedDate);
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.dateSelected.emit(this.selectedDate);
  }

}
