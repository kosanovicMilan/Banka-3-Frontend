import { Component, forwardRef, Input } from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Validation} from '../../../models/validation.model';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Input() disabledInput: boolean | null = false;
  @Input() validationRules: Validation[] = [];

  errors: string[] = [];
  isFocused: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  @Input() defaultErrorMessages: { [key: string]: string } = {
    required: 'This field is required',
    pattern: 'Invalid format',
  };
  @Input() errorMessages: { [key: string]: string } = {};

  @Input() formControlComp: any; // Accepts FormControl

  get showErrors(): boolean {
    if (!!this.formControlComp) {
      return !!(this.formControlComp?.invalid && (this.formControlComp?.touched || this.formControlComp?.dirty));
    }
    return this.errors.length > 0 && !this.isFocused && this.value.trim().length > 0;
  }

  writeValue(value: any): void {
    this.value = value || '';
    this.validate();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.validate();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.validate();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  validate(): void {
    this.errors = [];
    for (const rule of this.validationRules) {
      if (!rule.validate(this.value)) {
        this.errors.push(rule.message);
      }
    }
  }

  getMergedErrorMessages(): { [key: string]: string } {
    return { ...this.defaultErrorMessages, ...this.errorMessages };
  }

  getErrorKeys(): string[] {

    return this.formControlComp?.errors ? Object.keys(this.formControlComp.errors) : [];
  }
}
