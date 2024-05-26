import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

interface Transacao {
  listId: string;
  subtotal: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async getTransacoes(): Promise<Transacao[]> {
    const userId = await this.authService.getCurrentUserId();
    const transacoesSnapshot = await this.firestore.collection<Transacao>(`users/${userId}/transacoes`).ref.get();
    return transacoesSnapshot.docs.map(doc => doc.data() as Transacao);
  }

  async addTransacao(transacao: Transacao): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    const id = this.firestore.createId();
    await this.firestore.collection(`users/${userId}/transacoes`).doc(id).set({ ...transacao, id });
  }
}
