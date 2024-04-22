import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceData } from './add-device/add-device.component';


@Injectable({
  providedIn: 'root'  
})
export class DeviceService {
  private baseUrl = 'http://localhost:5000/api/v1/devices'; 

  constructor(private http: HttpClient) {}

  getDevices(): Observable<DeviceResponse> {
    return this.http.get<DeviceResponse>(this.baseUrl);
  }

  getDeviceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addDevice(device: any): Observable<any> {
    return this.http.post(this.baseUrl, device);
  }

  updateDevice(id: string, device: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, device);
  }

}

export interface DeviceResponse {
  devices: DeviceData[]
}