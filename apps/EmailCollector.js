// Returns a list of emails for every page on the domains of the URL list
const EightyApp = require('eighty-app');

let app = new EightyApp();

app.processDocument = function(html, url, headers, status, jQuery) {
	$ = jQuery;
	let $html = app.parseHtml(html, $);
	let object = {};

	// Get emails
	let emailList = html.match(/[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,})/gi);
	
	if (emailList.length >= 1) {
	    emailList.shift();
	    object = { emailList };
	}

    // It's possible that one page could contain the same email address multiple times, so we deduplify them.
	return app.removeAllDuplicates(object);
}

app.parseLinks = function(html, url, headers, status, jQuery) {
	let $ = jQuery;
	let $html = app.parseHtml(html, $);
	let links = [];

	let r = /:\/\/(.[^/]+)/;
	let urlDomain = url.match(r)[1]

	// gets all links in the html document
	$html.find('a').each(function(i, obj) {
		// console.log($(this).attr('href'));
		let link = app.makeLink(url, $(this).attr('href'));

		if (link != null) {
            let linkDomain = link.match(r);
            if (linkDomain && linkDomain.length > 1) {
                linkDomain = linkDomain[1];
            if (urlDomain.toLowerCase() == linkDomain.toLowerCase())
                links.push(link);
            }
		}
	});

	return links;
}

module.exports = () => {
	return app;
}
