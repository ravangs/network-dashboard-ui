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
import { Router } from '@angular/router';

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
    MatCheckboxModule,
  ]
})
export class AddDeviceComponent implements OnInit {
  isLinear = true;
  routerDetailsGroup: FormGroup;
  ospfConfGroup: FormGroup;
  bgpConfGroup: FormGroup;
  interfaceConfGroup: FormGroup;
  ipv6ConfGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private deviceService: DeviceService, private router: Router) {
    this.routerDetailsGroup = this._formBuilder.group({
      ip_address: ['', Validators.required],
      hostname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.ospfConfGroup = this._formBuilder.group({
      ospfJson: [this.getDefaultOSPF(), Validators.required],    });

    this.bgpConfGroup = this._formBuilder.group({
      bgpJson: [this.getDefaultBGP(), Validators.required]

    });

    this.interfaceConfGroup = this._formBuilder.group({
      interfacesJson: [this.getDefaultInterfaces(), Validators.required],
    });

    this.ipv6ConfGroup = this._formBuilder.group({
      ipv6Json: [this.getDefaultIpv6(), Validators.required],
    });
  }

  getDefaultInterfaces(): string {
    return JSON.stringify([{
      "name": "InterfaceName",
      "ip_address": "InterfaceIP",
      "subnet_mask": "SubnetMask",
      "status": "up/down"
    }], null, 2);
  }

  getDefaultOSPF(): string {
    return JSON.stringify({
      "process_id": "OSPFProcessID",
      "networks": [
        {
          "network_address": "NetworkAddress",
          "subnet_mask": "SubnetMask",
          "area": "Area"
        }
      ]
    }, null, 2);
  }

  getDefaultIpv6(): string {
    return JSON.stringify({
        "ipv6": [{
          "address": "IPv6Address",
          "enabled": true,
          "ospf_area": "OSPFIPv6Area"
        }]
    }, null, 2);
  }

  getDefaultBGP(): string {
    return JSON.stringify({
      "asn": "BGPASN",
      "neighbors": [
        {
          "neighbor_ip": "NeighborIP",
          "remote_as": "RemoteAS"
        }
      ],
      "networks": [
        {
          "network": "NetworkAddress",
          "mask": "SubnetMask"
        }
      ],
      "maximum_paths": "MaxPaths"
    }, null, 2);
  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.routerDetailsGroup.valid && this.ospfConfGroup.valid && this.bgpConfGroup.valid && this.interfaceConfGroup.valid) {
      const deviceData: DeviceData = {
        ip_address: this.routerDetailsGroup.value.ip_address,
        hostname: this.routerDetailsGroup.value.hostname,
        username: this.routerDetailsGroup.value.username,
        password: this.routerDetailsGroup.value.password,
        ospf: JSON.parse(this.ospfConfGroup.value.ospfJson),
        bgp:JSON.parse(this.bgpConfGroup.value.bgpJson),
        interfaces: JSON.parse(this.interfaceConfGroup.value.interfacesJson),
        ipv6: JSON.parse(this.ipv6ConfGroup.value.ipv6Json)
      };
  
      this.deviceService.addDevice(deviceData).subscribe({
        next: (response) => {
          console.log('Device added successfully!', response);
          this.router.navigate(['/view-devices']);
        },
        error: (error) => {
          console.error('Error adding device:', error);
        }
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

export interface IPv6Config {
  address: string;
  enabled: boolean;
  ospf_area: string;
}

export interface DeviceData {
  ip_address: string;
  hostname: string;
  username: string;
  password: string;
  ospf: OSPFConfig;
  bgp: BGPConfig;
  ipv6: IPv6Config[];
  interfaces: NetworkInterface[];
}

