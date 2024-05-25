import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.page.html',
  styleUrls: ['./entrar.page.scss'],
})
export class EntrarPage {
  email: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    this.resetErrors();

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/tabs/tab1']);
    } catch (error: unknown) {
      if (this.isFirebaseAuthError(error)) {
        if (error.code === 'auth/user-not-found') {
          this.emailError = true;
        } else if (error.code === 'auth/wrong-password') {
          this.passwordError = true;
        }
      } else {
        this.showToast('Erro ao fazer login. Por favor, tente novamente.');
      }
      this.password = '';
    }
  }

  resetErrors() {
    this.emailError = false;
    this.passwordError = false;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  private isFirebaseAuthError(error: any): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }
}
