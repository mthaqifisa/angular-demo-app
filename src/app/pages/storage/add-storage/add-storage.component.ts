import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-storage',
  imports: [
    FormsModule
  ],
  templateUrl: './add-storage.component.html',
  styleUrl: './add-storage.component.css'
})
export class AddStorageComponent {
  sessionKey: string = '';
  sessionValue: string = '';

  localKey: string = '';
  localValue: string = '';

  cookiesKey: string = '';
  cookiesValue: string = '';
  cookiesExpiry: number = 60; // Default: 1 hour

  stateKey: string = '';
  stateValue: string = '';


  setSession() {
    if (this.sessionKey && this.sessionValue) {
      sessionStorage.setItem(this.sessionKey, this.sessionValue);

      this.sessionKey = '';
      this.sessionValue = '';
    }
  }

  setLocal() {
    if (this.localKey && this.localValue) {
      localStorage.setItem(this.localKey, this.localValue);

      this.localKey = '';
      this.localValue = '';
    }
  }

  setCookies() {
    if (this.cookiesKey && this.cookiesValue) {
      const expirySeconds = this.cookiesExpiry * 60;
      const expiryDate = new Date(Date.now() + expirySeconds * 1000).toUTCString();
      document.cookie = `${this.cookiesKey}=${this.cookiesValue}; Expires=${expiryDate}; path=/`;
      document.cookie = `${this.cookiesKey}_expiry=${expiryDate}; Expires=${expiryDate}; path=/`; // Store expiry separately

      this.cookiesKey = '';
      this.cookiesValue = '';
      this.cookiesExpiry = 60; // Reset expiry to default (1 hour)
    }
  }

  setState() {
    if (this.stateKey && this.stateValue) {
      //this.store.dispatch({ type: 'UPDATE_STATE', payload: { [this.stateKey]: this.stateValue } });

      this.stateKey = '';
      this.stateValue = '';
    }
  }
}
