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

  async loadTransacoes() {
    try {
      this.transacoes = await this.transacaoService.getTransacoes();
    } catch (error) {
      console.error('Error loading transactions', error);
      this.transacoes = []; // Ensure transacoes is an array in case of an error
    }
  }
}
