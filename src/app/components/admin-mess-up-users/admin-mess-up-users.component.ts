import { Component, OnInit } from '@angular/core'
import {Router} from '@angular/router'
import {FlashMessagesService} from 'angular2-flash-messages'
import {AuthService} from '../../services/auth.service'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'
import {Http , HttpModule} from '@angular/http'
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {DataSource} from '@angular/cdk/table';
import { CdkTableModule } from '@angular/cdk/table';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-admin-mess-up-users',
  templateUrl: './admin-mess-up-users.component.html',
  styleUrls: ['./admin-mess-up-users.component.css']
})
export class AdminMessUpUsersComponent implements OnInit {

  users: any;
  displayedColumns: any;
  messUp: any;
  costUp: any;
  message:any;
  i: any;
  days: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private http: Http,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
  this.i =0; }

  ngOnInit() {
    const Info =this.authService.loadUserInfo();
    if (Info.userType !== "admin") {
      this.flashMessage.show("You must be a admin to access this page", {cssClass: 'alert-danger', timeout: 5000})
      this.router.navigate(['/'])
    } else if (Info.messType !== "mess2") {
      this.flashMessage.show("You cannot access this page", {cssClass: 'alert-danger', timeout: 5000})
      this.router.navigate(['/adminMess1Users'])
    }
    else {
      this.authService.getUsersmessUp().subscribe(data=>{
        if (data.data.success) {
          this.displayedColumns = ['day','breakfast','lunch','dinner'];
          this.messUp= data.data.users
          this.costUp = this.messUp.map(t => t.couponUpMess.map(val => val.messup.map(t => t.cost).reduce((acc, value) => acc + value, 0)));
          this.days = this.messUp.map(t => t.couponUpMess.map(val => val.messup));
          this.costUp.forEach((val, index)=>{
            for (this.i ; this.i<=index; this.i++) {
              this.messUp[index].cost = val[0];
              this.messUp[index].index = index + 1;
              if (this.messUp[index].cost === 0) {
                (this.messUp[index]) = undefined
              }
            }
          })

          this.messUp = this.messUp.filter((n) => { return n !== undefined })

        } else {
          this.message = data.message
        }
      })
    }
  }

  print() {
    var divToPrint = document.getElementById('print-section');
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table , table td, table thead{' +
        'border:1px solid #000;' +
        'padding:0.5em;' +
        'width: 50%;' +
        '}' +
        '#yes{' +
        'border:1px solid #000;' +
        'width: 50%;' +
        'padding:10px;' +
        'display:inline-block;'+
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    var newWin = window.open("");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
  }

}
