import { Component } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
})
export class ContaPage {
  firstName: string = '';
  lastName: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  city: string = '';
  postalCode: string = '';
  firstNameError: boolean = false;
  lastNameError: boolean = false;
  addressLine1Error: boolean = false;
  cityError: boolean = false;
  postalCodeError: boolean = false;

  constructor(private userDataService: UserDataService) {}

  submitInfo() {
    this.resetErrors();

    if (!this.firstName) {
      this.firstNameError = true;
    }
    if (!this.lastName) {
      this.lastNameError = true;
    }
    if (!this.addressLine1) {
      this.addressLine1Error = true;
    }
    if (!this.city) {
      this.cityError = true;
    }
    if (!this.postalCode) {
      this.postalCodeError = true;
    }

    if (!this.firstNameError && !this.lastNameError && !this.addressLine1Error && !this.cityError && !this.postalCodeError) {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        city: this.city,
        postalCode: this.postalCode
      };
      this.userDataService.setUserData(userData);
      this.showSuccessMessage();
    }
  }

  resetErrors() {
    this.firstNameError = false;
    this.lastNameError = false;
    this.addressLine1Error = false;
    this.cityError = false;
    this.postalCodeError = false;
  }

  async showSuccessMessage() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Informação salva com sucesso!';
    toast.duration = 2000;
    document.body.appendChild(toast);
    await toast.present();
  }
}
