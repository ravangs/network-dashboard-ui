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
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceData } from '../add-device/add-device.component';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
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

export class EditDeviceComponent implements OnInit {
  isLinear = true;
  routerDetailsGroup: FormGroup;
  ospfConfGroup: FormGroup;
  bgpConfGroup: FormGroup;
  interfaceConfGroup: FormGroup;
  hostname: string | null | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.routerDetailsGroup = this._formBuilder.group({
      ip_address: ['', Validators.required],
      hostname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.ospfConfGroup = this._formBuilder.group({
      ospf_enabled: [false],
      ospf_area: [''],
      ospf_networks: ['']
    });

    this.bgpConfGroup = this._formBuilder.group({
      bgp_enabled: [false],
      bgp_asn: [''],
      bgp_neighbors: this._formBuilder.array([])
    });

    this.interfaceConfGroup = this._formBuilder.group({
      interface_name: [''],
      interface_ip_address: [''],
      interface_description: [''],
      interface_status: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.hostname = params.get('hostname');
      if (this.hostname) {
        this.deviceService.getDeviceById(this.hostname).subscribe({
          next: (device) => this.populateForm(device.device),
          error: (error) => console.error('Error fetching device:', error)
        });
      }
    });
  }

  populateForm(device: any): void {
    console.log(device)
    this.routerDetailsGroup.patchValue({
      ip_address: device.ip_address,
      hostname: device.hostname,
      username: device.username,
    });
    this.ospfConfGroup.patchValue({
      ospf_enabled: device.ospf.enabled,
      ospf_area: device.ospf.area,
      ospf_networks: device.ospf.networks.join(',')
    });
    this.bgpConfGroup.patchValue({
      bgp_enabled: device.bgp.enabled,
      bgp_asn: device.bgp.asn,
      bgp_neighbors: device.bgp.neighbors
    });
    this.interfaceConfGroup.patchValue({
      interface_name: device.interfaces[0].interface_name,
      interface_ip_address: device.interfaces[0].interface_ip_address,
      interface_description: device.interfaces[0].interface_description,
      interface_status: device.interfaces[0].interface_status
    })
  }

  onSubmit(): void {
    if (this.routerDetailsGroup.valid && this.ospfConfGroup.valid && this.bgpConfGroup.valid && this.interfaceConfGroup.valid) {
      console.log(this.ospfConfGroup)
      const deviceData: DeviceData = {
        ip_address: this.routerDetailsGroup.value.ip_address,
        hostname: this.routerDetailsGroup.value.hostname,
        username: this.routerDetailsGroup.value.username,
        password: this.routerDetailsGroup.value.password,
        ospf: {
          enabled: this.ospfConfGroup.value.ospf_enabled,
          area: this.ospfConfGroup.value.ospf_area,
          networks: this.ospfConfGroup.value.ospf_networks.split(',').map((network: string) => network.trim())
        },
        bgp: {
          enabled: this.bgpConfGroup.value.bgp_enabled,
          asn: this.bgpConfGroup.value.bgp_asn,
          neighbors: this.processNeighbors(this.bgpConfGroup.value.bgp_neighbors)
        },
        interfaces: [{
          interface_name: this.interfaceConfGroup.value.interface_name,
          ip_address: this.interfaceConfGroup.value.interface_ip_address,
          description: this.interfaceConfGroup.value.interface_description,
          status: this.interfaceConfGroup.value.interface_status ? 'up' : 'down'
        }]
      };
      
      if(this.hostname){
        this.deviceService.updateDevice(this.hostname, deviceData).subscribe({
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

