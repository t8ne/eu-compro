import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4PageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then(m => m.Tab5PageModule)
  },
  {
    path: 'criarconta',
    loadChildren: () => import('./criarconta/criarconta.module').then(m => m.CriarcontaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'entrar',
    loadChildren: () => import('./entrar/entrar.module').then(m => m.EntrarPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module').then(m => m.ContaPageModule)
  },
  {
    path: 'transacoes',
    loadChildren: () => import('./transacoes/transacoes.module').then(m => m.TransacoesPageModule)
  },
  {
    path: 'locais',
    loadChildren: () => import('./locais/locais.module').then(m => m.LocaisPageModule)
  },
  {
    path: 'notificacoes',
    loadChildren: () => import('./notificacoes/notificacoes.module').then(m => m.NotificacoesPageModule)
  },
  {
    path: 'permissoes',
    loadChildren: () => import('./permissoes/permissoes.module').then(m => m.PermissoesPageModule)
  },
  {
    path: 'linguagem',
    loadChildren: () => import('./linguagem/linguagem.module').then(m => m.LinguagemPageModule)
  },
  {
    path: 'desativar-conta',
    loadChildren: () => import('./desativar-conta/desativar-conta.module').then(m => m.DesativarContaPageModule)
  },
  {
    path: 'documentacao-legal',
    loadChildren: () => import('./documentacao-legal/documentacao-legal.module').then(m => m.DocumentacaoLegalPageModule)
  },
  {
    path: 'lista/:id',
    loadChildren: () => import('./lista/lista.module').then(m => m.ListaPageModule)
  },
  {
    path: 'pagar',
    loadChildren: () => import('./pagar/pagar.module').then(m => m.PagarPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
