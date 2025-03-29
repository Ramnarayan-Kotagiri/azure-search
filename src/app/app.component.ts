import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import if using router-outlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'my-azure-search-app';

  constructor() {}

  ngOnInit(): void {
  }
}