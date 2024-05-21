import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    if (Capacitor.isNativePlatform()) {
      // Esconde a tela de splash após a inicialização
      await SplashScreen.hide();

      // Configura a barra de status para um estilo escuro
      await StatusBar.setStyle({ style: Style.Dark });

      // Lock screen orientation to portrait
      await ScreenOrientation.lock({ orientation: 'portrait' });
    }
  }
}
