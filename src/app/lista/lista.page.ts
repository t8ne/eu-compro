import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../services/list.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  currentList: any;
  listId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.listId = listId;
      this.currentList = this.listService.getListById(this.listId);
    }
  }

  calculateSubtotal(list: any): number {
    return list.items.reduce((total: number, item: any) => total + item.preco * item.quantity, 0);
  }

  goToPagar() {
    this.router.navigate(['/pagar'], {
      state: { subtotal: this.calculateSubtotal(this.currentList), listId: this.listId, name: this.currentList.name },
    });
  }

  async openCamera() {
    // Implementação da funcionalidade da câmara
  }
}
