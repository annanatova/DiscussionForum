import { Component, inject } from '@angular/core';
import { AuthService, ThemesService } from '../../../core/services';
import { Theme } from '../../../models';
import { ThemeItem } from "../theme-item/theme-item";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-theme-board',
  imports: [CommonModule, RouterLink, ThemeItem],
  templateUrl: './theme-board.html',
  styleUrls: ['./theme-board.css'] 
})
export class ThemeBoard {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;

  themes$: Observable<Theme[]>;

  constructor(private themeService: ThemesService) {
    this.themes$ = this.themeService.getThemes();
  }

  trackByThemeId(index: number, theme: Theme): string {
    return theme._id;
  }
}