import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonTextarea
} from '@ionic/angular/standalone'

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonTextarea
  ]
})

export class TextAreaComponent implements OnInit{
  @Input() text: string = "";
  @Input() label: string = "";
  placeholder: string = "";

  // Optional configuration
  @Input() rows: number = 3;

  @Output() textChanged = new EventEmitter<string>();

  ngOnInit(): void {
    this.placeholder = `Enter ${this.label} here`;
  }

  onTextChange(event: any) {
    this.text = event.target.value;
    this.textChanged.emit(this.text);
  }

}
