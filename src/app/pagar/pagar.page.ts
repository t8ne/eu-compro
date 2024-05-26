import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
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
  listId: string | null = null;
  listName: string | null = null; // Add this line

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storageService: StorageService,
    private transacaoService: TransacaoService
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { subtotal: number, listId: string, listName: string }; // Add listName here
    if (state) {
      this.subtotal = state.subtotal;
      this.listId = state.listId;
      this.listName = state.listName; // Add this line
    }

    this.firstName = await this.storageService.get('firstName') || '';
    this.lastName = await this.storageService.get('lastName') || '';
    this.addressLine1 = await this.storageService.get('addressLine1') || '';
    this.addressLine2 = await this.storageService.get('addressLine2') || '';
    this.city = await this.storageService.get('city') || '';
    this.postalCode = await this.storageService.get('postalCode') || '';
  }

  onImageClick(event: any) {
    console.log('Image clicked', event.target.alt);
  }

  async submitProposal() {
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
      if (this.listId && this.listName) { // Check for listName
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
