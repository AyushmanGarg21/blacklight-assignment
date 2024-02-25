import { Component, OnInit,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {NgFor, NgIf} from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, HttpClientModule,FormsModule ,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  title = 'client';
  currentWeekLeaderboard: any[] = [];
  lastWeekLeaderboard: any[] = [];
  userRank: any;
  userId : string = "";
  http: any;
  constructor(http: HttpClient) { 
    this.http = http;
  };
  ngOnInit(): void {
    this.getCurrentWeekLeaderboard();
  }

  getCurrentWeekLeaderboard(): void {
    this.http.get('http://localhost:3000/currentWeekLeaderboard')
      .subscribe((data: any[]) => {
        this.currentWeekLeaderboard = data;
      });
  }

  getLastWeekLeaderbord(country: string): void {
    this.http.get(`http://localhost:3000/lastWeekLeaderboard/${country}`)
      .subscribe((data: any[]) => {
        this.lastWeekLeaderboard = data;
      });
  }

  getUserRank(): void {
    this.http.get(`http://localhost:3000/userRank/${this.userId}`)
      .subscribe((data: any[]) => {
        this.userRank = data;
      });
  }
}