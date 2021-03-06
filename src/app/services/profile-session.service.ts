import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { AuthenticationService } from '@security/authentication.service';
import { UserProfile, UserProfileStructure } from '@api/model/user-profile.model';

@Injectable()
export class ProfileSession {
  private currentStructure: UserProfileStructure;
  private _hasPortfolioStructures: boolean = false;
  private _hasOwnStructure: boolean = false;
  private _ownStructure: UserProfileStructure;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {

    if (localStorage.getItem('structure-id') !== null) {
      this.currentStructure = {
        name: localStorage.getItem('structure-name'),
        id: localStorage.getItem('structure-id')
      };
    }

    this.authService.profileSubject.subscribe((profile: UserProfile) => {
      if (profile === null) {
        this.currentStructure = null;
        return;
      }

      this._hasPortfolioStructures = profile.portfolio_structures.length !== 0;
      this._hasOwnStructure = profile.structure !== null;
      this._ownStructure = profile.structure;
      if (!this._hasPortfolioStructures) {
        this.currentStructure = profile.structure;
      }
    });
  }

  public getCurrentStructure(): UserProfileStructure {
    return this.currentStructure;
  }

  public navigateToStructure(structure: UserProfileStructure): void {
    this.currentStructure = structure;
    localStorage.setItem('structure-name', structure.name);
    localStorage.setItem('structure-id', structure.id);

    this.router.navigate(['folders']);
  }

  public hasOwnStructure(): boolean {
    return this._hasOwnStructure;
  }

  public getOwnStructure(): UserProfileStructure {
    return this._ownStructure;
  }

  public navigateToOwnStructure() {
    return this.navigateToStructure(this._ownStructure);
  }

  public hasPortfolioStructures(): boolean {
    return this._hasPortfolioStructures;
  }
}
