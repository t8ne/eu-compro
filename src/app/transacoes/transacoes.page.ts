import { Component, OnInit } from '@angular/core';
import { TransacaoService } from '../services/transacao.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.page.html',
  styleUrls: ['./transacoes.page.scss'],
})
export class TransacoesPage implements OnInit {
  transacoes: any[] = [];

  constructor(private transacaoService: TransacaoService) {}

  ngOnInit() {
    this.loadTransacoes();
  }

  loadTransacoes() {
    this.transacoes = this.transacaoService.getTransacoes();
  }
}
