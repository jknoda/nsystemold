import { EventEmitter, Injectable  } from '@angular/core';

@Injectable()
export class TopoService {

  isAuthenticated = new EventEmitter<boolean>();
  
  constructor() {}
}
