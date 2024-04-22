import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DeviceService } from '../device.service';
import { DeviceData } from '../add-device/add-device.component';

@Component({
  selector: 'app-view-devices',
  templateUrl: './view-device.component.html',
  styleUrls: ['./view-device.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,  
    RouterOutlet,
    MatButtonModule
  ]
})
export class ViewDeviceComponent implements OnInit {
  devices: DeviceData[] = [];
  displayedColumns: string[] = ['hostname', 'bgpEnabled', 'ospfEnabled'];

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe(devices => {
      this.devices = devices.devices;
      // Assuming the API returns a 'devices' array within the response
    });
  }

  navigateToDevice(hostname: string): void {
    this.router.navigate(['/edit-device', hostname]);
  }

  goToAddDevice(): void {
    this.router.navigate(['/add-device']);
  }
}
