import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    if (Capacitor.isNativePlatform()) {
      // Esconde a tela de splash após a inicialização
      SplashScreen.hide();

      // Configura a barra de status para um estilo escuro
      StatusBar.setStyle({ style: Style.Dark });
    }
  }
}
