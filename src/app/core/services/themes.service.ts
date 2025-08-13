import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Theme } from "../../models";

@Injectable({
  providedIn: 'root' 
})
export class ThemesService {
  private apiUrl = 'http://localhost:3000/api/themes';
  
  constructor(private httpClient: HttpClient) {}

  getThemes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(this.apiUrl);
  }

  createTheme(themeName: string, postText: string): Observable<Theme> {
    return this.httpClient.post<Theme>(this.apiUrl, { themeName, postText }, {
      withCredentials: true,
    });
  }

  getThemeById(id: string): Observable<Theme> {
    return this.httpClient.get<Theme>(`${this.apiUrl}/${id}`);
  }

  subscribe(themeId: string, userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/${themeId}/subscribe`, { userId });
  }

  unsubscribe(themeId: string, userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/${themeId}/unsubscribe`, { userId });
  }

deleteTheme(themeId: string): Observable<any> {
  return this.httpClient.delete(
    `${this.apiUrl}/${themeId}`,
    { withCredentials: true }
  );
}

updateTheme(themeId: string, themeName: string): Observable<Theme> {
    return this.httpClient.patch<Theme>(
        `${this.apiUrl}/${themeId}`,
        { themeName }
    );
}
}