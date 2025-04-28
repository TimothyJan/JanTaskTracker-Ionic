import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  async presentToast(
    message: string,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
    duration: number = 1500
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    });

    await toast.present();
  }

  async presentSuccessToast(message: string) {
    await this.presentToast(message, 'bottom', 2000);
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
