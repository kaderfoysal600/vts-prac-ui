import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
loggedInEmail :any;
  constructor( public router: Router) { }

  ngOnInit(): void {
    this.loggedInEmail = sessionStorage.getItem('email')
  }
  onLogOut(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email')
    this.router.navigate(['/auth/login']);
  }

}
