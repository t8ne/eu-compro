import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async getLists(): Promise<any[]> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listsSnapshot = await this.firestore.collection(`users/${userId}/lists`).get().toPromise();
    const lists = listsSnapshot?.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as object)  // Cast data to object
    })) || [];
    return lists as any[];
  }

  async getListById(listId: string): Promise<any> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listDoc = await this.firestore.doc(`users/${userId}/lists/${listId}`).ref.get();
    return listDoc.exists ? { id: listDoc.id, ...(listDoc.data() as object) } : null;  // Cast data to object
  }

  async createList(name: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const id = this.firestore.createId();
    await this.firestore.collection(`users/${userId}/lists`).doc(id).set({ id, name, items: [] });
  }

  async renameList(listId: string, newName: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.firestore.collection(`users/${userId}/lists`).doc(listId).update({ name: newName });
  }

  async addItemToList(listId: string, item: any): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const listRef = this.firestore.collection(`users/${userId}/lists`).doc(listId);
    const listDoc = await listRef.get().toPromise();

    if (listDoc && listDoc.exists) {
      const listData = listDoc.data() as any;
      const existingItem = listData.items.find((listItem: any) => listItem.name === item.name);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        listData.items.push(item);
      }

      await listRef.update({ items: listData.items });
    } else {
      await listRef.set({ items: [item] }, { merge: true });
    }
  }

  async deleteList(listId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.firestore.collection(`users/${userId}/lists`).doc(listId).delete();
  }

  async updateLists(lists: any[]): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const batch = this.firestore.firestore.batch();
    lists.forEach(list => {
      const listRef = this.firestore.collection(`users/${userId}/lists`).doc(list.id).ref;
      batch.set(listRef, list);
    });
    await batch.commit();
  }

  async getNotificacoes(): Promise<any[]> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const notificacoesSnapshot = await this.firestore.collection(`users/${userId}/notificacoes`).get().toPromise();
    if (!notificacoesSnapshot) {
      return [];
    }
    return notificacoesSnapshot.docs.map(doc => {
      const data = doc.data() as Record<string, any>; // Ensure data is treated as an object
      return { id: doc.id, ...data };
    });
  }

  async createNotificacao(message: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const timestamp = new Date();
    await this.firestore.collection(`users/${userId}/notificacoes`).add({ message, timestamp });
  }
}
