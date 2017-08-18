import {
  ComponentRef,
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var _: any;

/**
 * A service with a bunch of utility functions for performing common tasks.
 */
@Injectable()
export class UtilService {

  constructor(private cfResolver: ComponentFactoryResolver) {}

  /**
   * Dynamically creates a component within some container component.
   * @param {Class} clazz The constructor for the dynamic component.
   * @param {ViewContainerRef} container The parent component.
   * @param {int} [index=0] The child index for the dynamic component within
   *                        its parent. If this is -1, it will be added as
   *                        the last child.
   * @return {ComponentRef}
   */
  createDynamicComponent(clazz: any, container: ViewContainerRef, index=0): ComponentRef<any> {
    if(index === -1)
      index = undefined;
    let factory = this.cfResolver.resolveComponentFactory(clazz);
    let injector = container.injector;
    return container.createComponent(factory, index, injector);
  }

  /**
   * Gets the map of URL parameters and query parameters
   * for a route as a Promise.
   * @param {ActivatedRoute} route
   * @return {map<string, any>}
   */
  getRouteParams(route: ActivatedRoute): Promise<any> {
    return Promise.all([
      new Promise(resolve => {
        route.params.forEach(params => {
          resolve(params);
        });
      }),
      new Promise(resolve => {
        route.queryParams.forEach(params => {
          resolve(params);
        });
      })
    ])
    .then(results => {
      let [params, queryParams] = results;
      return _.extend({}, params, queryParams);
    });
  }

  /**
   * Returns a Promise after waiting one or more event loop cycles.
   * @param {int} [millis=0]  The number of milliseconds to wait.
   * @return {Promise}
   */
  waitCycle(millis = 0): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }
};
