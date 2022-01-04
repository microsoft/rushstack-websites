import React from "react";

import { FormField, FormFieldSet } from "./FormFieldSet";

export class FormTextField extends FormField {
  protected formFieldSet: FormFieldSet;

  private _value: string = "";

  public constructor(formFieldSet: FormFieldSet) {
    super();
    this.formFieldSet = formFieldSet;
    this.formFieldSet.add(this);
  }

  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this.formFieldSet.notifyFieldChanged(this);
    }
  }

  public onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    this.value = event.target.value;
  };
}

export function FormTextBox(props: { field: FormTextField }): JSX.Element {
  return (
    <input
      type="text"
      style={{ width: "20em" }}
      value={props.field.value}
      onChange={props.field.onChange}
    />
  );
}
