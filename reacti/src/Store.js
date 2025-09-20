import { action, computed, makeObservable, observable, toJS } from "mobx";

export class Store {
  apiResponse = [];

  constructor() {
    makeObservable(this, {
      apiResponse: observable,
      setApiResponse: action,
    });
  }

  setApiResponse(value) {
    this.apiResponse = value;
  }
}
