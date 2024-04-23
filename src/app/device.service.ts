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

  getDevices(): Observable<GetDeviceResponse> {
    return this.http.get<GetDeviceResponse>(this.baseUrl);
  }

  getDeviceById(hostname: string): Observable<GetDeviceResponse> {
    return this.http.get<GetDeviceResponse>(`${this.baseUrl}/${hostname}`);
  }

  addDevice(device: any): Observable<any> {
    return this.http.post(this.baseUrl, device);
  }

  updateDevice(hostname: string, device: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${hostname}`, device);
  }

}

export interface GetDeviceResponse {
  devices: DeviceData[]
}

export interface GetDeviceResponse {
  device: DeviceData
}
