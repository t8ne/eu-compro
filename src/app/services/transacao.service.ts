import { Injectable } from '@angular/core';

interface Transacao {
  listId: string;
  subtotal: number;
  name: string; // Add name here
}

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private transacoes: Transacao[] = [];

  constructor() {}

  getTransacoes(): Transacao[] {
    return this.transacoes;
  }

  addTransacao(transacao: Transacao) {
    this.transacoes.push(transacao);
  }
}
