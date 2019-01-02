import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteService } from '../../services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../core/data/remote-data';
import { isNotUndefined } from '../../empty.util';
import { first, map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { DataService } from '../../../core/data/data.service';
import { NormalizedDSpaceObject } from '../../../core/cache/models/normalized-dspace-object.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

/**
 * Component representing the edit page for communities and collections
 */
@Component({
  selector: 'ds-edit-comcol',
  template: ''
})
export class EditComColPageComponent<TDomain extends DSpaceObject, TNormalized extends NormalizedDSpaceObject> implements OnInit {
  /**
   * Frontend endpoint where for this type of DSP
   */
  protected frontendURL: string;
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  public constructor(
    protected dsoDataService: DataService<TNormalized, TDomain>,
    protected routeService: RouteService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.data.pipe(first(), map((data) => data.dso));
  }

  /**
   * @param {TDomain} dso The updated version of the DSO
   * Updates an existing DSO based on the submitted user data and navigates to the editted object's home page
   */
  onSubmit(dso: TDomain) {
    this.dsoDataService.update(dso)
      .pipe(getSucceededRemoteData())
      .subscribe((dsoRD: RemoteData<TDomain>) => {
        if (isNotUndefined(dsoRD)) {
          const newUUID = dsoRD.payload.uuid;
          this.router.navigate([this.frontendURL + newUUID]);
        }
      });
  }
}
