import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-storage',
  imports: [
  ],
  templateUrl: './view-storage.component.html',
  styleUrl: './view-storage.component.css'
})

export class ViewStorageComponent implements OnInit {
  sessionData: string = '';
  localData: string = '';
  cookiesData: string = '';
  appState$: string = 'nil';
  gmtTime: string = '';

  ngOnInit(): void {
    this.loadStorageData();
    this.updateGMTTime();
    setInterval(() => this.updateGMTTime(), 1000); // Refresh every second
  }

  updateGMTTime(): void {
    const now = new Date();
    this.gmtTime = now.toUTCString(); // Converts to GMT
  }

  loadStorageData(): void {
    // Load Session Storage
    this.sessionData = JSON.stringify(sessionStorage, null, 2);

    // Load Local Storage
    this.localData = JSON.stringify(localStorage, null, 2);

    // Load Cookies with Expiry
    const cookiesArray = document.cookie.split("; ");
    let cookiesInfo: string = "";

    cookiesArray.forEach(cookie => {
      const [key, value] = cookie.split("=");
      if (!key.includes("_expiry")) {
        const expiryKey = `${key}_expiry`;
        const expiryCookie = cookiesArray.find(c => c.startsWith(expiryKey));
        const expiryTime = expiryCookie ? expiryCookie.split("=")[1] : "Unknown";
        cookiesInfo += `${key}: ${value}\nExpiry: ${expiryTime}\n\n`;
      }
    });

    this.cookiesData = cookiesInfo;
  }

  resetAllStorage(): void {
    // Clear Local Storage
    localStorage.clear();

    // Clear Session Storage
    sessionStorage.clear();

    // Clear Cookies
    document.cookie.split(";").forEach(cookie => {
      const [key] = cookie.split("=");
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    // Refresh displayed data
    this.loadStorageData();
  }
}
