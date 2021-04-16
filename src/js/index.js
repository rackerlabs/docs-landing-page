var app = require('./app');
import React from 'react';
import ReactDOM from 'react-dom';
import App from './imports/App';
var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 300 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };

function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("product-type");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.parentElement.className += " active";
}
window.onload = function () {
    if (document.getElementById("gs-ctrl") != undefined) {
        document.getElementById("gs-ctrl").className += " active"
    }
    if (!window.location.href.includes("faq") && !window.location.href.includes("all-articles") && (document
            .getElementById("acc-man") != undefined)) {
        document.getElementById("acc-man").className += " active";
    }
    if (window.location.href.includes("faq") && (document.getElementById("acc-faq") != undefined)) {
        document.getElementById("acc-faq").className += " active";
    }
    if (window.location.href.includes("all-articles") && (document.getElementById("acc-all") != undefined)) {
        document.getElementById("acc-all").className += " active";
    }
    if (window.location.href.includes("faq")) {
        var elements = document.getElementsByClassName("panel-group");
        for (var i = 0; i < elements.length; i++) {
            elements[i].className += " faq-list"
        }
        $('a[data-toggle="collapse"]').addClass('inactive');
    }
    $("table").addClass(["table", "table-striped", "table-bordered"]);

    var arrOfPtags = document.getElementsByTagName("p");
    for (var i = 0; i < arrOfPtags.length; i++) {
        if (arrOfPtags[i].innerHTML.toLowerCase().includes("<strong>note</strong>") || arrOfPtags[i].innerHTML
            .toLowerCase().includes("<strong>note:</strong>")) {
            arrOfPtags[i].className += "callout-note";
        }
        if (arrOfPtags[i].innerHTML.toLowerCase().includes("<strong>important</strong>") || arrOfPtags[i]
            .innerHTML.toLowerCase().includes("<strong>important:</strong>")) {
            arrOfPtags[i].className += "callout-important";
        }
        if (arrOfPtags[i].innerHTML.toLowerCase().includes("<strong>warning</strong>") || arrOfPtags[i]
            .innerHTML.toLowerCase().includes("<strong>warning:</strong>")) {
            arrOfPtags[i].className += "callout-warning";
        }
        if (arrOfPtags[i].innerHTML.toLowerCase().includes("<strong>tip</strong>") || arrOfPtags[i].innerHTML
            .toLowerCase().includes("<strong>tip:</strong>")) {
            arrOfPtags[i].className += "callout-tip";
        }
    }
    $('#searchModal').on("shown.bs.modal", function() {
        $('.ais-SearchBox-input').focus();
    })
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
}
algoliasearchNetlify({
    appId: 'I0JO56OFYD',
    apiKey: 'ce5576a8109906d7cbc0c7ebdff2c2e2',
    siteId: 'f6012b1b-e032-4bb3-91f5-addb2e700fe2',
    branch: 'master',
    selector: 'div#crawler-search',
  });

ReactDOM.render(<App />, document.getElementById('search'));
