import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage {
  listId: string;

  constructor(private navCtrl: NavController, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.listId = navigation?.extras.state?.['listId'] || null;
  }

  goBack() {
    if (this.listId) {
      this.router.navigate([`/lista/${this.listId}`]);
    } else {
      this.router.navigate(['/tabs/tab2']);
    }
  }
}
