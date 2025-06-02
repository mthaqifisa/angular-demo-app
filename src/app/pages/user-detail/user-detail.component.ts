import {Component, OnInit} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {UserApiService} from '../../services/user-api.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-detail',
  imports: [
    NzCardComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    ReactiveFormsModule,
    NzButtonComponent,
    NgIf
  ],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  originalData: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserApiService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadUserData(params['id']);
    });
  }

  private loadUserData(userId: number) {
    this.userService.getUser(userId).subscribe(user => {
      this.originalData = user;
      this.initializeForm(user);
    });
  }

  private initializeForm(data: any) {
    this.userForm = this.fb.group({
      id: [data.id],
      username: [data.username],
      email: [data.email],
      macAddress: [data.macAddress],
      university: [data.university],
      address: this.fb.group({
        address: [data.address.address],
        city: [data.address.city],
        state: [data.address.state],
        postalCode: [data.address.postalCode],
        coordinates: this.fb.group({
          lat: [data.address.coordinates.lat],
          lng: [data.address.coordinates.lng]
        })
      }),
      bank: this.fb.group({
        cardNumber: [data.bank.cardNumber],
        cardExpire: [data.bank.cardExpire],
        cardType: [data.bank.cardType],
        currency: [data.bank.currency],
        iban: [data.bank.iban]
      })
    });

    this.disableForm();
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
      this.userForm.patchValue(this.originalData);
    }
  }

  saveChanges() {
    const updatedData = this.userForm.value;
    this.userService.updateUser(updatedData.id, updatedData).subscribe({
      next: () => {
        this.message.success('User updated successfully');
        this.originalData = updatedData;
        this.toggleEdit();
      },
      error: () => this.message.error('Error updating user')
    });
  }

  private disableForm() {
    this.userForm.disable();
  }
}
