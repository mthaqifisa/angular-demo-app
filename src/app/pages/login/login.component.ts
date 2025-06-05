import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import * as AuthActions from '../../state/auth/auth.actions';
import * as AuthSelectors from '../../state/auth/auth.selectors';
import { LoginRequest } from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  private subscription = new Subscription();

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  ngOnInit(): void {
    // Subscribe to loading state
    this.subscription.add(
      this.store.select(AuthSelectors.selectLoading).subscribe(loading => {
        this.loading = loading;
      })
    );

    // Subscribe to error state
    this.subscription.add(
      this.store.select(AuthSelectors.selectError).subscribe(error => {
        this.error = error;
      })
    );

    // Subscribe to authentication state
    this.subscription.add(
      this.store.select(AuthSelectors.selectIsAuthenticated).subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/welcome']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const credentials: LoginRequest = {
        username: this.validateForm.value.username!,
        password: this.validateForm.value.password!
      };

      if (!this.store) {
        console.error('Store is undefined in LoginComponent');
        this.error = 'Authentication service is not available';
        return;
      }

      try {
        this.store.dispatch(AuthActions.login({ credentials }));
      } catch (error) {
        console.error('Error dispatching login action:', error);
        this.error = 'Failed to process login request';
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
