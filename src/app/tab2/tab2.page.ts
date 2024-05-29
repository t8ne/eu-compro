import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../services/list.service';
import { AlertController, ActionSheetController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('slidingItem') slidingItems!: QueryList<IonItemSliding>;

  lists: any[] = [];
  filteredLists: any[] = [];
  searchQuery: string = '';
  listUpdateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private listService: ListService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    this.loadLists();
    this.listUpdateSubscription = this.listService.listUpdated.subscribe(() => {
      this.loadLists();
    });
  }

  ngOnDestroy() {
    if (this.listUpdateSubscription) {
      this.listUpdateSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const slidingItem = this.slidingItems.first;
      if (slidingItem) {
        slidingItem.open('start');
        setTimeout(() => {
          slidingItem.close();
        }, 500); // Close after half a second
      }
    }, 500); // Open after half a second
  }

  async loadLists() {
    try {
      this.lists = await this.listService.getLists();
      this.filteredLists = this.lists.map(list => ({
        ...list,
        totalQuantity: this.calculateTotalQuantity(list)
      }));
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  }

  openList(listId: string) {
    this.router.navigate(['/lista', listId]);
  }

  async presentPrompt() {
    const alert = await this.alertController.create({
      header: 'Nova Lista',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nome da Lista'
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
            if (data.name) {
              await this.listService.createList(data.name);
              this.loadLists();
            } else {
              this.showToast('Nome da lista necessário para a sua criação.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteList(list: any) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem a certeza que quer eliminar esta lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Eliminar',
          handler: async () => {
            await this.listService.deleteList(list.id);
            this.loadLists();
          }
        }
      ]
    });

    await alert.present();
  }

  async openActionSheet(list: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Renomear',
          icon: 'create',
          handler: () => {
            this.presentRenamePrompt(list);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: async () => {
            await this.confirmDeleteList(list);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentRenamePrompt(list: any) {
    const alert = await this.alertController.create({
      header: 'Renomear Lista',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: list.name,
          placeholder: 'Nome da Lista'
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
            if (data.name) {
              await this.listService.renameList(list.id, data.name);
              this.loadLists();
            } else {
              this.showToast('Nome da lista não pode estar vazio.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  doReorder(event: CustomEvent) {
    const fromIndex = event.detail.from;
    const toIndex = event.detail.to;

    const itemToMove = this.lists.splice(fromIndex, 1)[0];
    this.lists.splice(toIndex, 0, itemToMove);

    event.detail.complete();

    this.listService.updateLists(this.lists);
    this.filterLists();
  }

  filterLists() {
    const query = this.searchQuery.toLowerCase();
    this.filteredLists = this.lists.filter(list =>
      this.normalize(list.name).includes(this.normalize(query))
    );
  }

  calculateTotalQuantity(list: any): number {
    return list.items.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  normalize(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
