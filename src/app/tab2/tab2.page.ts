import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../services/list.service';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  lists: any[] = [];
  filteredLists: any[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private listService: ListService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  async loadLists() {
    this.lists = await this.listService.getLists();
    this.filteredLists = this.lists;
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
              this.filterLists();

              // Trigger change detection manually
              this.changeDetectorRef.detectChanges();
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
            this.loadLists();
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
              this.loadLists();
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
