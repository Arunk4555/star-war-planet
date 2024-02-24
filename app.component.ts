import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
interface Planet {
  name: string;
  climate: string;
  population: string;
  terrain: string;
  residents: string[];
}

interface Resident {
  name: string;
  height: string;
  mass: string;
  gender: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'planet-3';
  planets: Planet[]=[];
  nextPage: string | null=null;
  residents: { [key: string]: Resident[] } = {};

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchPlanets('https://swapi.dev/api/planets/?format=json');
  }
  fetchPlanets(url: string): void {
    this.http.get<any>(url).subscribe(data => {
      this.planets = [...this.planets, ...data.results];
      this.nextPage = data.next;
      this.loadResidents();
    }, error => {
      console.error('Error fetching planets:', error);
    });
  }
  fetchResidents(residentUrls: string[], planetName: string): void {
    const residentRequests = residentUrls.map(url =>
      this.http.get<Resident>(url).toPromise().catch(() => null)
    );
    Promise.all(residentRequests).then(residents => {
      this.residents[planetName] = residents.filter(resident => resident !== null) as Resident[];
    });
  }
  loadResidents(): void {
    this.planets.forEach(planet => {
      this.fetchResidents(planet.residents, planet.name);
    });
  }
  loadMorePlanets(): void {
    if (this.nextPage) {
      this.fetchPlanets(this.nextPage);
    }
  }






}
