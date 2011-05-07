/**
 * Creates a gallery in an HTML page.
 */
(function(window, undefined) {

    var mygal = (function() {

        var root = {};

        var KEYS = {
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            LEFT: 37,
            RIGHT: 39
        };
        (function() {
            var i;
            for (i=48; i<=122; i++) {
                KEYS[String.fromCharCode(i)] = i;
            }
        })();
    
        var getUrlHashProperty = function(key) {
            var hashProperties = window.location.hashProperties;
            if (hashProperties === undefined) {
                window.location.hashProperties = hashProperties = {};
                var hash = window.location.hash;
                if (hash != null && hash.length > 0) {
                    hash = hash.substring(1);
                }
                $.each(hash.split('&'), function(index, part) {
                    var partSplit = part.split('=');
                    var key = partSplit[0];
                    if (key) {
                        hashProperties[key] = partSplit[1];
                    }
                });
            }
            return hashProperties[key];
        };
    
        var setUrlHashProperty = function(key, value) {
            var hashProperties = window.location.hashProperties;
            if (hashProperties === undefined) {
                window.location.hashProperties = hashProperties = {};
            }
            hashProperties[key] = value;
            var hash = '#';
            var first = true;
            $.each(hashProperties, function(key, value) {
                if (first) {
                    first = false;
                } else {
                    hash += '&';
                }
                hash += key + '=' + value;
            });
            window.location.hash = hash;
        };
    
        var init = root.init = function(options) {
            var photoIndex;
            var photos;

            options = $.extend(
                {
                    navigation: '.navigation',
                    photosSource: './photos.json',
                    thumbnailUrl: function(url) {
                        return 'thumbnail_' + url;
                    },
                    imageUrl: function(url) {
                        return 'medium_' + url;
                    }
                },
                options
            );
    
            var preloadPhoto = function(index) {
                if (index < photos.length) {
                    var photo = photos[index];
                    new Image().src = photo.mediumUrl ||
                        options.imageUrl(photo.url);
                }
            };

            var showPhoto = function(index, fromIndex) {
                setUrlHashProperty('photoIndex', index);
                $('.navigation .inactive').removeClass('inactive');
                if (index === 0) {
                    $('.navigation .nav_previous').addClass('inactive');
                }
                if (index === photos.length-1) {
                    $('.navigation .nav_next').addClass('inactive');
                }
                $('.overview .active_photo').removeClass('active_photo');
                var activeThumbnail = $('.overview .thumbnail')
                .slice(index, index+1).addClass('active_photo');
                var overview = $('.overview').scrollTop(0);
                var top = activeThumbnail.position().top -
                    (overview.height() - activeThumbnail.height())/2;
                overview.scrollTop(top);
                var photo = photos[index];
                var url = photo.mediumUrl || options.imageUrl(photo.url);
                var img = $('<a class="photo_img"/>')
                .attr({ 'href': url, target: '_blank' })
                .css(
                    'background-image',
                    'url(' + url + ')'
                );
                $('.photo_view .photo').empty().append(img);
                var subtitle = $('.photo_view .subtitle').empty();
                if (photo.subtitle) {
                    subtitle.text(photo.subtitle);
                }
                preloadPhoto(index+1);
                photoIndex = index;
            };
        
            var showPrevious = function() {
                if (photoIndex > 0) {
                    showPhoto(photoIndex-1, photoIndex);
                }
            };
        
            var showNext = function() {
                if (photoIndex < photos.length-1) {
                    showPhoto(photoIndex+1, photoIndex);
                }
            };
        
            var preventDefaultFn = function(fn) {
                return function(event) {
                    event.preventDefault();
                    return fn(event);
                };
            };
        
            var createOverview = function() {
                var overview = $('.overview');
                $.each(photos, function(index, photo) {
                    var url = photo.thumbnail_url ||
                        (options.thumbnailUrl(photo.url));
                    var img = $('<img/>').attr('src', url);
                    var thumbnail = $('<div class="thumbnail"/>').append(img)
                    .click(function() {
                        showPhoto(index, photoIndex);
                    });
                    overview.append(thumbnail);
                });
            };
        
            var keyboardHandler = function(e) {
                var code = e.keyCode !== 0 ? e.keyCode : e.charCode;
                switch (code) {
                    case KEYS.b:
                    case KEYS.B:
                    case KEYS.p:
                    case KEYS.P:
                    case KEYS.PAGEUP:
                    case KEYS.SPACE:
                    case KEYS.LEFT:
                        showPrevious();
                        break;
                    case KEYS.n:
                    case KEYS.N:
                    case KEYS.PAGEDOWN:
                    case KEYS.RIGHT:
                        showNext();
                        break;
                }
            };
        
            var start = function(startIndex) {
                $('.navigation a').show();
                showPhoto(startIndex || 0);
                $('.navigation .nav_previous')
                .click(preventDefaultFn(showPrevious));
                $('.navigation .nav_next')
                .click(preventDefaultFn(showNext));
                $(document).keypress(keyboardHandler);
            };
        
            $.getJSON(options.photosSource, function(data) {
                $('.navigation a').hide();
                photos = data.photos;
                createOverview();
                var startIndex = getUrlHashProperty('photoIndex');
                if (startIndex) {
                    start(parseInt(startIndex, 10));
                } else {
                    preloadPhoto(0);
                    $('.start').click(function() { start(0); });
                }
            });
        };
    
        return root;
    })();

    window.mygal = mygal;

})(window);

