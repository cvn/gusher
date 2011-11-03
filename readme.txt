

                         __
       ____ ___  _______/ /_  ___  _____
      / __ `/ / / / ___/ __ \/ _ \/ ___/
     / /_/ / /_/ (__  ) / / /  __/ /
     \__, /\__,_/____/_/ /_/\___/_/
    /____/


Gusher creates a chronological activity stream. 
You can add feeds from any of the services below:

    Delicious
    Disqus
    Flickr
    Github
    Google+
    Google Calendar
    Google Reader
    Instapaper
    Last.fm
    Stack Overflow
    Tumblr
    Twitter
    Vimeo
    YouTube

It consists of two parts:

    Gusher Server
       node.js module, manages Gusher accounts    
    gusher.js
       client-side script, fetches feeds and renders streams

Gusher uses technology from:

    jQuery
    ICanHaz.js
    mustache.js
    Node.js
    Express framework
    MongoDB

Release notes:

  0.3
    Added server-side component.
  0.23
    Separated user name, id, and api key from feed_url, 
    Daily Booth support added, 
    "Likes:" & "Replies:" only display when necessary.
  0.22
    CSS cleanup, New icons. 
    Moved feed rendering from feeds.js to go.js.
  0.21
    Added support for Github activity and Commit feeds.
  0.2
    Wrote a Feed class to standardize the way feeds are created.
  0.1
    Initial release.

Plans for the future:

  * Visual display of Likes & replies (color coded?)
  * Refactor property names so they are grouped
  * choose a color per feed
  * allow adding links to page
  * put username in & AJAX check to see if it exists
  * option to show just one post per feed
  * global time limit adjustment
  * support for feeds about users
    - visually comes from right side, different css class

Candidates for future support:

  * Facebook
  * Blogger
  * Reddit
  * Soundcloud
  * Instagram
  * Twitter favorites & filtering replies.
  * Amazon (wishlist)?
  * Pinboard?
  * Canv.as?
  * Mlkshk?
  * Netflix?
  * Newgrounds?
  * vBulletin?


Chad von Nau

