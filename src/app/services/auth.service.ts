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
    try{
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-user-token' || error.code === 'auth/user-disabled') {
      throw new Error('auth/user-not-found');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('auth/wrong-password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('auth/invalid-email');
    } else {
      throw error;
    }
  }
}

  async register(email: string, password: string) {
    try{
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('auth/email-already-in-use');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('auth/weak-password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('auth/invalid-email');
    } else {
      throw error;
    }
  }
  }

  async logout(): Promise<void> {
    try{
    await this.afAuth.signOut();
  } catch (error) {
    throw error;
  }
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
