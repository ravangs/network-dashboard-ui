import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../device.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
  standalone: true,
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatCheckboxModule
  ]
})
export class AddDeviceComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  ip_address = "abcd";

  constructor(private _formBuilder: FormBuilder, private deviceService: DeviceService) {
    this.firstFormGroup = this._formBuilder.group({
      ip_address: [this.ip_address, Validators.required],
      hostname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      ospf_enabled: [false],
      ospf_area: [''],
      ospf_networks: ['']
    });

    this.thirdFormGroup = this._formBuilder.group({
      bgp_enabled: [false],
      bgp_asn: [''],
      bgp_neighbors: this._formBuilder.array([])
    });

    this.fourthFormGroup = this._formBuilder.group({
      interface_name: [''],
      interface_ip_address: [''],
      interface_description: [''],
      interface_status: [false]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourthFormGroup.valid) {
      const deviceData: DeviceData = {
        ip_address: this.firstFormGroup.value.ip_address,
        hostname: this.firstFormGroup.value.hostname,
        username: this.firstFormGroup.value.username,
        password: this.firstFormGroup.value.password,
        ospf: {
          enabled: this.secondFormGroup.value.ospf_enabled,
          area: this.secondFormGroup.value.ospf_area,
          networks: this.secondFormGroup.value.ospf_networks.split(',').map((network: string) => network.trim())
        },
        bgp: {
          enabled: this.thirdFormGroup.value.bgp_enabled,
          asn: this.thirdFormGroup.value.bgp_asn,
          neighbors: this.processNeighbors(this.thirdFormGroup.value.bgp_neighbors)
        },
        interfaces: [{
          interface_name: this.fourthFormGroup.value.interface_name,
          ip_address: this.fourthFormGroup.value.interface_ip_address,
          description: this.fourthFormGroup.value.interface_description,
          status: this.fourthFormGroup.value.interface_status ? 'up' : 'down'
        }]
      };
  
      this.deviceService.addDevice(deviceData).subscribe({
        next: (response) => console.log('Device added successfully!', response),
        error: (error) => console.error('Error adding device:', error)
      });
    }
  }
  
  private processNeighbors(neighborsArray: any[]): any[] {
    return neighborsArray.map(neighbor => {
      return {
        ip: neighbor.ip,
        remote_asn: neighbor.remote_asn
      };
    });
  }
}

export interface OSPFConfig {
  enabled: boolean;
  area: string;
  networks: string[];
}

export interface BGPNeighbor {
  ip: string;
  remote_asn: string;
}

export interface BGPConfig {
  enabled: boolean;
  asn: string;
  neighbors: BGPNeighbor[];
}

export interface NetworkInterface {
  interface_name: string;
  ip_address: string;
  description: string;
  status: string;
}

export interface DeviceData {
  ip_address: string;
  hostname: string;
  username: string;
  password: string;
  ospf: OSPFConfig;
  bgp: BGPConfig;
  interfaces: NetworkInterface[];
}

