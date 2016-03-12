/**
 * This script copies src/index.html into build/index.html
 * This is a good example of using Node and cheerio to do a simple file transformation.
 * It might be useful when we only want to do smth. specific in the built production code.
 */

/*eslint-disable no-console */

var fs = require('fs');
var colors = require('colors');
var cheerio = require('cheerio');

fs.readFile('src/index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err);
  }

  const $ = cheerio.load(markup);

  // Since a separate stylesheet is only utilized for the production build, need to dynamically add this here.
  $('head').append('<link rel="stylesheet" href="/css/app.css">');
  $('link[href]').each(function(i, linkEl) {

    const $linkEl = $(linkEl);
    const href = $linkEl.attr('href');
    if (href && href[0] === '/') {
      $linkEl.attr('href', '/build' + href);
    }
  });
  $('script[src]').each(function(i, linkEl) {

    const $linkEl = $(linkEl);
    const src = $linkEl.attr('src');
    console.log(src);
    if (src && src[0] === '/') {
      $linkEl.attr('src', '/build' + src);
    }
  });
  fs.writeFile('index.html', $.html(), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log('index.html written to /'.green);
});
