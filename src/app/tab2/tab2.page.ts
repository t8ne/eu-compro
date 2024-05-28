import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../services/list.service';
import { AlertController, ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  lists: any[] = [];
  filteredLists: any[] = [];
  searchQuery: string = '';
  listUpdateSubscription: Subscription = new Subscription(); // Initialize with a default value

  constructor(
    private router: Router,
    private listService: ListService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready(); // Ensure the platform is ready before loading lists
    await this.loadLists();
    this.listUpdateSubscription = this.listService.listUpdated.subscribe(() => {
      this.loadLists();
    });
  }

  ngOnDestroy() {
    if (this.listUpdateSubscription) {
      this.listUpdateSubscription.unsubscribe();
    }
  }

  async loadLists() {
    this.lists = await this.listService.getLists();
    this.filteredLists = this.lists;
    this.filteredLists.forEach(list => {
      list.totalQuantity = this.calculateTotalQuantity(list);
    });
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
              await this.loadLists();
              this.filterLists();
            } else {
              this.showToast('Nome da lista necessário para a sua criação.');
            }
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
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: async () => {
            await this.listService.deleteList(list.id);
            await this.loadLists();
            this.filterLists();
          }
        }, {
          text: 'Rename',
          icon: 'create',
          handler: () => {
            this.presentRenamePrompt(list);
          }
        }, {
          text: 'Cancel',
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
      header: 'Rename List',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: list.name,
          placeholder: 'List Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
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
              await this.loadLists();
              this.filterLists();
            } else {
              this.showToast('List name cannot be empty');
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

    // Move the item in the array
    const itemToMove = this.lists.splice(fromIndex, 1)[0];
    this.lists.splice(toIndex, 0, itemToMove);

    // Complete the reorder event
    event.detail.complete();

    // Update the service
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
