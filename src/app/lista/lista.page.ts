import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../services/list.service';
import { IonItemSliding, AlertController, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, AfterViewInit {
  currentList: any = { items: [] }; // Ensure items is initialized as an empty array
  listId: string = '';

  @ViewChildren('slidingItem') slidingItems!: QueryList<IonItemSliding>;

  constructor(
    private route: ActivatedRoute,
    private listService: ListService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.listId = listId;
      this.currentList = await this.listService.getListById(this.listId) || { items: [] };
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstSlidingItem = this.slidingItems.first;
      if (firstSlidingItem) {
        firstSlidingItem.open('start');
        setTimeout(() => {
          firstSlidingItem.close();
        }, 500); // Close after half a second
      }
    }, 500); // Open after half a second
  }

  calculateSubtotal(list: any): number {
    return list.items.reduce((total: number, item: any) => total + item.preco * item.quantity, 0);
  }

  getTotalQuantity(list: any): number {
    return list.items.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  async updateItemQuantity(item: any) {
    const alert = await this.alertController.create({
      header: 'Quantidade',
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          value: item.quantity,
          min: 1,
          placeholder: 'Quantidade'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            if (data.quantity && data.quantity > 0) {
              item.quantity = parseInt(data.quantity, 10);
              await this.listService.updateListItems(this.listId, this.currentList.items);
              this.changeDetectorRef.detectChanges(); // Trigger change detection
              this.showToast('Quantidade alterada.');
            } else {
              this.showToast('Quantidade inválida.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goToPagar() {
    this.router.navigate(['/pagar'], {
      state: {
        subtotal: this.calculateSubtotal(this.currentList),
        listId: this.listId,
        listName: this.currentList.name
      }
    });
  }

  async openCamera() {
    try {
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const result = await BarcodeScanner.requestPermissions();
        if (result.camera !== 'granted') {
          return;
        }
      }
      const result = await BarcodeScanner.scan();
      // Process the barcode result if needed
    } catch (error) {
      console.error('Erro de Código de Barras: ', error);
    }
  }

  async deleteItem(item: any) {
    const alert = await this.alertController.create({
        header: 'Confirmar',
        message: 'Tem certeza de que deseja remover este item?',
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('Confirm Cancel');
                }
            }, 
            {
                text: 'Ok',
                handler: async () => {
                    this.currentList.items = this.currentList.items.filter((i: any) => i !== item);
                    await this.listService.updateListItems(this.listId, this.currentList.items);
                    this.changeDetectorRef.detectChanges(); // Trigger change detection
                    this.showToast('Produto removido da Lista.');
                }
            }
        ]
    });

    await alert.present();
}


  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
