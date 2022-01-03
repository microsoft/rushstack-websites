import { ObjectEvent } from "../library/ObjectEvent";

export abstract class FormField {}

export class FormFieldSet {
  public readonly updated: ObjectEvent = new ObjectEvent(this);

  private readonly _fields: Set<FormField> = new Set();

  private _resetting: boolean = false;
  private _modified: boolean = false;

  public constructor(component?: React.Component) {
    if (component) {
      this.updated.subscribe(component, () => component.forceUpdate());
    }
  }

  public get modified(): boolean {
    return this._modified;
  }

  public add(field: FormField): void {
    this._fields.add(field);
  }

  public notifyFieldChanged(field: FormField): void {
    if (!this._resetting) {
      this._modified = true;
      this.updated.fire({});
    }
  }

  public resetFields(action: () => void): void {
    if (this._resetting) {
      throw new Error("assignFields() cannot be nested");
    }
    try {
      this._resetting = true;
      action();
    } finally {
      this._modified = false;
      this._resetting = false;
    }
    this.updated.fire({});
  }
}
