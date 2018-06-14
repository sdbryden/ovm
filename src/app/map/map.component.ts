import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HassService } from '../hass.service';
import { map } from 'rxjs/operators';
declare var Snap: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() myEvent = new EventEmitter<string>();

  constructor(
    private hassService: HassService
  ) { }

  ngOnInit() {
    const s = Snap('#svgout');
    const g = s.group();
    const fplan = Snap.load('../../assets/fplan.svg', (f) => {
        g.append(f); // draw svg
        this.hassService.states
          .pipe(map(entities => entities.filter(entity => entity.entity_id.startsWith('group.')))) // get groups
          .subscribe(entities => {
            entities.forEach( entity => {
              const name = entity.entity_id.replace('group.', '');
              const shape = s.select('g[inkscape\\:label="' + name + '"]');
              if (shape) { shape.click(() => this.myEvent.emit(name)); } // add click event
            });
          });
    });
  }

}
