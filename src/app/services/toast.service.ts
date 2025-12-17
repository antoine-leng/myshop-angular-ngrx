import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface ToastConfig extends MatSnackBarConfig {
  type?: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  show(message: string, config?: ToastConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };

    // Ajouter une classe CSS selon le type
    if (config?.type) {
      finalConfig.panelClass = [
        'toast-notification',
        `toast-${config.type}`,
        ...(Array.isArray(finalConfig.panelClass) ? finalConfig.panelClass : []),
      ];
    }

    return this.snackBar.open(message, 'Fermer', finalConfig);
  }

  success(message: string, config?: MatSnackBarConfig) {
    return this.show(message, { ...config, type: 'success' });
  }

  error(message: string, config?: MatSnackBarConfig) {
    return this.show(message, { ...config, type: 'error', duration: 5000 });
  }

  info(message: string, config?: MatSnackBarConfig) {
    return this.show(message, { ...config, type: 'info' });
  }

  warning(message: string, config?: MatSnackBarConfig) {
    return this.show(message, { ...config, type: 'warning' });
  }
}