import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LitsItemHandlerService {

  constructor() { }

  //bekommt eine managed list und id und setzt die ActiveItemId auf die entsprechende id

  setActive(id: number | undefined, managedList: { activeItemId: number | undefined, list: Array<any> }) {

    if(managedList.activeItemId) {

      if(managedList.list.find(item => item.id == managedList.activeItemId)) {
        const activeItem = managedList.list.find(item => item.id == managedList.activeItemId);
        activeItem.isActive = false;
      }
    }

    managedList.activeItemId = id;

    if(managedList.activeItemId) {
      const newActiveItem = managedList.list.find(item => item.id == id);
      newActiveItem.isActive = true;
    }

    return managedList;
  }
}
