import $ from 'jquery';
import loginTemplate from './templates/login.html';
import Login from './components/login';

$(document).ready(function() {
    new Login(loginTemplate);
});
