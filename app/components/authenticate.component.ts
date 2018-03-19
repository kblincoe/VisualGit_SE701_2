import { Component } from "@angular/core";
import { openForgotPasswordPage } from "../misc/forgotPassword";

@Component({
  selector: "user-auth",
  template: `
    <div class="authenticate" id="authenticate">
      <nav class="navbar navbar-inverse" role="navigation">
        <div class="container-fluid">
          <button class="btn btn-inverse dropdown-toggle btn-sm navbar-btn" id="color-scheme" data-toggle="dropdown">
            color
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" id="color-dropdown" role="menu" aria-labelledby="branch-name">
            <li class="white" onclick="changeColor('white')">white</li>
            <li class="green" onclick="changeColor('green')">green</li>
            <li class="blue" onclick="changeColor('blue')">blue</li>
            <li class="default" onclick="changeColor('default')">default</li>
          </ul>
        </div>
      </nav>

      <form role="form" style="text-align:center; margin-top:100px">
        <label>
          <h1>VisualGit</h1>
        </label>
        <br><br>
        <div class="input-group" style="width:280px;">
          <input id="username" type="text" class="form-control" placeholder="username" aria-describedby="basic-addon1">
        </div>
        <br>
        <div class="input-group" style="width:280px;">
          <input id="password" type="password" class="form-control" placeholder="password" aria-describedby="basic-addon1">
        </div>
        <div class="form-check" style="padding-top: 10px; padding-left: 170px">
        <input type="checkbox" class="form-check-input" id="rememberme">
        <label class="form-check-label" for="checkbox-1" style="color: #9d9d9d">Remember Me</label>
      </div>
        <div style="padding-top: 5px;">
          <a href="javascript:void(0);" (click)="openForgotPasswordPage()" style="padding-left: 170px;">Forgot Password</a>
        </div>
        <br>
        <br>
        <div>
          <button type="submit" style="width:280px;" class="btn btn-success" (click)="switchToMainPanel()">Sign In</button>
        </div>
        <br>
        <button type="submit" style="width:280px;" class="btn btn-primary" onclick="switchToMainPanel()">Continue without sign in</button>
      </form>
    </div>
    <img src onerror='autoFillPassword()'>
  `
})

export class AuthenticateComponent {
  switchToMainPanel(): void {
    signInPage(switchToMainPanel);
  }

  openForgotPasswordPage(): void {
    openForgotPasswordPage();
  }
}
