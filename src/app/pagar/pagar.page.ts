import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserDataService } from '../services/user-data.service';
import { TransacaoService } from '../services/transacao.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.page.html',
  styleUrls: ['./pagar.page.scss'],
})
export class PagarPage implements OnInit {
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
  subtotal: number = 0;
  listId: string = '';
  listName: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private userDataService: UserDataService,
    private transacaoService: TransacaoService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { subtotal: number, listId: string, name: string };
    if (state) {
      this.subtotal = state.subtotal;
      this.listId = state.listId || '';
      this.listName = state.name || '';
    }

    const userData = this.userDataService.getUserData();
    if (userData) {
      this.firstName = userData.firstName || '';
      this.lastName = userData.lastName || '';
      this.addressLine1 = userData.addressLine1 || '';
      this.addressLine2 = userData.addressLine2 || '';
      this.city = userData.city || '';
      this.postalCode = userData.postalCode || '';
    }
  }

  onImageClick(event: any) {
    console.log('Image clicked', event.target.alt);
  }

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
      if (this.listId) {
        this.transacaoService.addTransacao({ listId: this.listId, subtotal: this.subtotal, name: this.listName });
      }
      this.router.navigate(['/pedido'], { state: { listId: this.listId } });
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
