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
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    this.resetErrors();

    if (!this.email) {
      this.emailError = 'Por favor digite um Email.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Formato de Email não reconhecido.';
      this.password = '';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Palavra-passe não introduzida.';
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = 'Palavra-passe demasiado pequena.';
      this.password = '';
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/tabs/tab1']);
    } catch (error: any) {
      if (this.isFirebaseAuthError(error)) {
        if (error.code === 'auth/user-not-found') {
          this.emailError = 'Email não registado.';
          this.email = '';
          this.password = '';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          this.passwordError = 'Palavra-passe incorreta.';
          this.password = '';
        } else if (error.code === 'auth/invalid-email') {
          this.emailError = 'Formato de Email não reconhecido.';
          this.password = '';
        } else {
          this.showToast('Erro ao fazer login. Por favor, tente novamente.');
        }
      } else {
        this.showToast('Erro ao fazer login. Por favor, tente novamente.');
      }
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
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
