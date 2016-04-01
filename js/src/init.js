'use strict';

var slideContent = '';
var sliderData = [];

function loadJSON(url, callback) {

  var xhr;

  if (typeof XMLHttpRequest !== 'undefined') {
    xhr = new XMLHttpRequest();
  }
  else {
    var versions = [
      "MSXML2.XmlHttp.5.0",
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0",
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"
    ];

    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      }
      catch(e){}
    } // end for
  }

  function ensureReadiness() {
    if (xhr.readyState < 4) {
      return;
    }

    if (xhr.status !== 200) {
      return;
    }

    // all is well
    if (xhr.readyState === 4) {
      var datePadding = JSON.parse(xhr.responseText).total;
      xhr = JSON.parse(xhr.responseText).posts;
      callback(xhr, datePadding);
    }
  }

  xhr.onreadystatechange = ensureReadiness;

  xhr.open('GET', url, true);
  xhr.send('');
}


// Left pad a number with a '0'
function padNumber(int) {
  if (int < 10) {
    return '0' + int;
  }
  return int;
}

// Formats a month with a left padded '0' if a single digit.
function formatMonth(date) {
  return padNumber(date.getMonth() + 1);
}

// Formats a day with a left padded '0' if a single digit.
function formatDay(date) {
  return padNumber(date.getDate());
}

// Subtrack a certain number of days from the date.
function subtractDays(date, days) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

// Get today's date.
var today = new Date('2014-03-04 12:00:00 -05:00');
var currentMonth = formatMonth(today);
var currentDay = formatDay(today);


var domReady = function(callback) {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    callback();
  }
  else {
    document.addEventListener("DOMContentLoaded", callback);
  }
};

// The dom is ready, do your magic.
domReady(function() {

  var path = '/api/' + currentMonth + '-slides.json';

  loadJSON(path, function(sliderData, totalSlides) {

    for (var i = 0; i < totalSlides; i++) {
      var postMonth = formatMonth(subtractDays(today, i));
      var postDate = postMonth + '-' + formatDay(subtractDays(today, i));
      var id = 'l-post--' + postDate;
      slideContent = '<div id="' + id + '" class="l-post ' + id + ' swiper-slide" data-hash="' + postDate + '">' + sliderData[postDate] + '</div>' + slideContent;
    }

    document.getElementById('js-art-slider__inner').innerHTML = slideContent;

    var mySwiper = new Swiper('#js-art-slider', {
      initialSlide: totalSlides - 1,
      slideClass: 'l-post',
      wrapperClass: 'art-slider__inner',
      autoHeight: true,
      centeredSlides: true,
      grabCursor: true,
      nextButton: '.nav-next',
      prevButton: '.nav-prev',
      keyboardControl: true,
      uniqueNavElements: false,
      // hashnav: true,
      preloadImages: true,
      updateOnImagesReady: true,
    });

    window.picturefill();
  });



}
);
