import { Component, Input } from '@angular/core';

import {
  Container,
  Control,
  OptionsControl,
  asOptionsControl,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-settings-bar',
  templateUrl: './settings-bar.component.html',
  styleUrls: ['./settings-bar.component.css'],
})
export class SettingsBarComponent {
  @Input() model!: Container;

  public readonly getControlIds = (): string[] => this.model.getControlIds();

  public readonly getControl = (id: string): Control =>
    this.model.getControl(id);

  public getOptionsControl(id: string): OptionsControl {
    const control: Control = this.getControl(id);
    const options: OptionsControl | undefined = asOptionsControl(control);
    if (options) return options;
    else throw new Error('Invalid options control for id ' + id);
  }
}
