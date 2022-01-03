import React from "react";

import { FormField, FormFieldSet } from "./FormFieldSet";
import { FormTextField } from "./FormTextBox";

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

export function FormComboBox(props: { field: FormComboField }): JSX.Element {
  let optionKey: number = 0;
  const openElements: JSX.Element[] = props.field.choices.map((x) => (
    <option key={optionKey++} value={x}>
      {x}
    </option>
  ));

  return (
    <select value={props.field.value} onChange={props.field.onChange}>
      {openElements}
    </select>
  );
}
