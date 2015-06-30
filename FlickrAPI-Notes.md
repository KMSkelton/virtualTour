###Image Sizes
*Mobile: 400x400
*Desktop: 
*tablet: (add-on)

###Flickr Rules we should be aware of

* You shall place the following notice prominently on your application: "This product uses the Flickr API but is not endorsed or certified by Flickr."
	
* In ALL cases, you are solely responsible for making use of Flickr photos in compliance with the photo owners' requirements or restrictions.

* If you use the Authentication APIs, insert a standard header that we will provide into pages you build that access the Flickr API. It's important to us that users have an easy way to return to Flickr if they wish, and have some reference point (the logo) to show them that they're still connected to Flickrland. <http://www.flickr.com/services/partners/>

* Disclose in your application through a privacy policy or otherwise displayed in the footer of each page, how you collect, use, store, and disclose data collected from visitors, including, where applicable, that third parties (including advertisers) may serve content and/or advertisements and collect information directly from visitors and may place or recognize cookies on visitors' browsers.

* Cache or store any Flickr user photos other than for reasonable periods in order to provide the service you are providing to Flickr users.

* To help prevent this, we limit the access to the API per key. If your application stays under 3600 queries per hour across the whole key (which means the aggregate of all the users of your integration), you'll be fine.

* How to attribute individual photos: <https://www.flickr.com/services/developer/attributions/>


### Photo Search arguments

<https://www.flickr.com/services/api/flickr.photos.search.html>

* tag
* safe search
* content type: not screenshots, photos only
* license type id
* sort: interestingness: desc
* has geo, lat, lon
<https://www.flickr.com/services/api/flickr.photos.getWithGeoData.html>

* use photo ID to get specific size
<https://www.flickr.com/services/api/misc.urls.html>

