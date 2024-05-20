import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.page.html',
  styleUrls: ['./pagar.page.scss'],
})
export class PagarPage {
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

  constructor(private router: Router) {}

  submitProposal() {
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
      const listId = history.state.listId; // Retrieve the listId from history state
      this.router.navigate(['/pedido'], { state: { listId } });
    }
  }

  resetErrors() {
    this.firstNameError = false;
    this.lastNameError = false;
    this.addressLine1Error = false;
    this.cityError = false;
    this.postalCodeError = false;
  }
}
