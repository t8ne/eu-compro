import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-criarconta',
  templateUrl: './criarconta.page.html',
  styleUrls: ['./criarconta.page.scss'],
})
export class CriarContaPage {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async createAccount() {
    try {
      const user = await this.authService.register(this.email, this.password);
      this.showToast('Conta criada com sucesso!');
      this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      this.showToast('Erro ao criar a conta. Por favor, tente novamente.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
