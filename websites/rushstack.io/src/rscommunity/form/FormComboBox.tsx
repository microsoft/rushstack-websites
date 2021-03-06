import React from 'react';

import { FormTextField } from './FormTextBox';

export class FormComboField extends FormTextField {
  private _choices: string[] = [];

  public get choices(): readonly string[] {
    return this._choices;
  }

  public set choices(value: readonly string[]) {
    this._choices = Array.from(value);
    this.formFieldSet.notifyFieldChanged(this);
  }
}

export function FormComboBox(props: { field: FormComboField; emptyStringMessage?: string }): JSX.Element {
  let optionKey: number = 0;
  const openElements: JSX.Element[] = props.field.choices.map((x) => (
    <option key={optionKey++} value={x}>
      {x === '' ? props.emptyStringMessage ?? x : x}
    </option>
  ));

  return (
    <select style={{ width: '20em' }} value={props.field.value} onChange={props.field.onChange}>
      {openElements}
    </select>
  );
}
