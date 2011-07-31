# mygal
A simple and stupid image gallery. Given some JSON data (that mygal
loads via AJAX), mygal injects a gallery into the DOM.

## Usage
Define the photos that you want to have in the gallery in a file as JSON data.
This JSON data defines an object with the properties `photos`. The value of
`photos` is an array of the gallery photos. Each element is an object with
the following propertes:

* `url` (required): The URL of the fullscreen image. 
* `thumbnail_url` (optional): The URL of the thumbnail image.
* `medium_url` (optional): The URL of the medium sized image.
  This is used for the inline view.
* `subtitle` (optional): A descriptive text to show for the photo.

Example:
<pre><code>
    {
        "photos": [
            {
                "url": "img001.png",
                "subtitle": "Awesome stuff"
            }
        ]
    }
</code></pre>

Call mygal.init() to inject the gallery.

<pre></code>
    &lt;script type="text/javascript"&gt;
      $(function() { mygal.init(); });
    &lt;/script&gt;
</code></pre>

This will render an overview (using the thumbnails) into an element with the
CSS `overview`, the current image into `.photo_view .photo` and the subtitle
into `.photo_view .subtitle`.

It will add event handlers to `.navigation .nav_previous` and
`.navigation .nav_next`.

## Options
You can call `mygal.init()` with an optional `options` parameter
(`mygal.init(options)`). This is an object which can have the following
properties:

* `navigation`: The navigation node (default: `'.navigation'`).
* `overview`: The overview node (default: `'.overview'`).
* `photoDisplay`: The photo display node (default: `'.photo_view .photo'`).
* `photosSource`: The URI of the photo JSON data (default: `'./photos.json'`).
* `photoSubtitle`: The photo subtitle node (default: `'.photo_view .subtitle'`).
* `thumbnailUrl`: A function to turn the full screen photo URL into a thumbnail
  URL (default: a function that prepends `'thumbnail_'`).
* `imageUrl`: A function to turn the full screen photo URL into a medium image
  URL (default: a function that prepends `'medium_'`).

## Example
For an example, see `/example/index.html`.
