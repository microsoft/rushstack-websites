import React from 'react';

import { FormField, FormFieldSet } from './FormFieldSet';

export class FormCheckField extends FormField {
  protected formFieldSet: FormFieldSet;

  private _checked: boolean = false;

  public constructor(formFieldSet: FormFieldSet) {
    super();
    this.formFieldSet = formFieldSet;
    this.formFieldSet.add(this);
  }

  public get checked(): boolean {
    return this._checked;
  }

  public set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      this.formFieldSet.notifyFieldChanged(this);
    }
  }

  public onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.checked = event.target.checked;
  };
}

export function FormCheckBox(props: { field: FormCheckField; disabled?: boolean }): JSX.Element {
  return (
    <input
      type="checkbox"
      disabled={props.disabled}
      checked={props.field.checked}
      onChange={props.field.onChange}
    />
  );
}
