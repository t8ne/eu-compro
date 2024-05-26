import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
  
  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result;
  }

  async register(email: string, password: string) {
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    return result;
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  // Get current user
  async getCurrentUser(): Promise<firebase.User | null> {
    try {
      return await this.afAuth.currentUser;
    } catch (error) {
      throw error;
    }
  }
  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  }

  // Delete user account
  async deleteUser() {
    const user = await this.getCurrentUser();
    if (user) {
      await user.delete();
    }
  }
}
