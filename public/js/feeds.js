// Define Feed Parameters

/*
var TemplateParams = {
  feed_url: '',
  base: '',
  tester: function(){},
  date: '',
  normalizer: function(str){return str},
  service: '',
  site: '',
  title: '',
  body: '',
  icon: 'http://',
  type: '',
  post_icon: '',
  post_url: '',
  comments: '',
  replies: '',
  likes: '',
  template: '',
  user_id: '',
  user_name: '',
  user_url: 'http://',
  debug: 0
}
*/

var DailyBoothPhotosParams = {
  feed_url: 'https://api.dailybooth.com/v1/pictures.json?id=USERID&callback=?',
  date: 'created_at', //2011-10-27T10:42:34+0000
  normalizer: function(str){return str.replace('+0000','Z')},
  service: 'DailyBooth',
  comments: 'blurb',
  body: function(data){ return '<p><img src="' + data.urls.large.replace(/cdn\d/,'cloudfront') + '"></p>' },  //remove the replace hack once dailybooth fixes API
  icon: 'http://dailybooth.com/favicon.ico',
  type: 'photo',
  post_url: function(data){ return 'http://dailybooth.com/USERNAME/'.replace('USERNAME', data.user_name) + data.picture_id },
  replies: 'comment_count',
  template: 'photoTemplate',
  user_name: 'asakawano',
  user_id: '798589',
  user_url: 'http://dailybooth.com/USERNAME'
}

var DeliciousBookmarksParams = {
  feed_url: 'http://feeds.delicious.com/v2/json/USERNAME?count=LIMIT&callback=?',
  date: 'dt', //2011-10-02T00:28:21Z
//normalizer: function(str){return str.replace(/-/g,'/').replace(/[TZ]/g,' ')},
  service: 'Delicious',
  site: function(data){ return getHost(data.u); },
  title: 'd',
  body: 'n',
  icon: 'http://delicious.com/favicon.ico',
  type: 'bookmark',
//post_icon: function(data){ return getFavicon(data.u) },
  post_url: 'u',
//comments: function(data){ return 'tags: ' + data.t.join(', ') }
  template: 'linkTemplate',
  user_name: 'chadvonnau',
  user_url: 'http://delicious.com/USERNAME'
}

var DisqusCommentsParams = {
  feed_apikey: '1bkW3wy8wM24welSl5cjLD1ID2g2YylT0DeDMYbs4oXM8gzCdW2YbZP68MidUMdx',
  feed_url: 'http://disqus.com/api/3.0/users/listPosts.jsonp?user:username=USERNAME&limit=LIMIT&related=thread&related=forum&api_key=APIKEY&callback=?',
  base: 'response',
  date: 'createdAt', //2011-10-02T19:33:55
  normalizer: function(str){ return str+'Z' },
  service: 'Disqus',
  site: function(data){ return getHost(data.url); }, //'forum.name'
  title: function(data){ return 'RE: '+ $('<div/>').html(data.thread.title).text() },
  body: 'message',
  icon: 'http://disqus.com/favicon.ico',
  type: 'add_comment',
//post_icon: function(data){ return getFavicon(data.url) },
  post_url: 'url',
  comments: function(data){ return (data.likes) ? 'Likes: '+data.likes : '' },
  template: 'linkTemplate',
  user_name: 'eyeburn',
  user_url: 'http://disqus.com/USERNAME'
}

var FlickrPhotosParams = {
  feed_url: 'http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&id=USERID&jsoncallback=?',
  base: 'items',
  date: 'published', //2011-05-29T14:58:21Z
  service: 'Flickr',
  title: 'title',
  body: function(data){ return '<p><img class="photo" src="' + data.media.m.replace(/_m.jpg$/,'_z.jpg') + '" /></p>' },
  icon: 'http://flickr.com/favicon.ico',
  type: 'photo',
  post_url: 'link',
  template: 'photoTemplate',
  user_id: '24661669@N03',
  user_name: 'chadvonnau',
  user_url: 'http://www.flickr.com/photos/USERNAME'
}
FlickrPhotosParams.comments = function(data){
  var input = data.description;
  var regex = /<p>(.*?)<\/p>/g;
  if(regex.test(data.description)) {
    input = input.match(regex)[2];
    if(input!=undefined)
      input = input.replace('<p>','').replace('</p>','');
  }
  return input;
}

var GithubActivityParams = {
  feed_url: 'https://github.com/USERNAME.json?callback=?',
  date: 'created_at', //2011/09/06 18:37:17 -0700
  service: 'Github',
  //likes: function(data){ if(data.repository) return data.repository.watchers },
  icon: 'http://github.com/favicon.ico',
  template: 'linkTemplate',
  tester: function(data){ if(data.type=='CreateEvent' && !(data.repository)) return false },
  type: function(data){ return (data.type=='WatchEvent') ? 'bookmark' : 'code' },
  user_name: 'cvn',
  user_url: 'https://github.com/USERNAME'
}
GithubActivityParams.title = function(data){
  var contents = '';
  if (data.repository) {
    contents = data.repository.name;
  } else if (data.payload) {
    contents = data.payload.desc;
  }
  return contents;
}
GithubActivityParams.body = function(data){
  var contents = '';
  if (data.type=='CreateEvent'){
    contents = 'created ' + (data.payload.ref || '') + ' ' + data.payload.ref_type;
  } else if (data.type=='PushEvent'){
    contents = data.payload.shas[0][2];
  } else if (data.type=='WatchEvent'){
    contents = data.repository.description;
  } else if (data.payload.action=='update'){
    contents = 'updated';
  } else if (data.payload.action){
    contents = data.payload.action;
  } else {
    contents = data.type;
  }
  return contents;
}
GithubActivityParams.post_url = function(data){
  var contents = '';
  if (data.repository && !(data.payload.shas)){
    contents = data.repository.url;
  } else {
    contents = data.url;
  }
  return contents;
}
GithubActivityParams.comments = function(data){
  var contents = '';
  if (data.repository){
    contents = data.repository.description;
  }
  return contents;
}

var GithubCommitsParams = {
  feed_url: 'http://github.com/api/v2/json/commits/list/USERNAME/USERID/master?callback=?',
  base: 'commits',
  date: 'committed_date', //2011/09/06 18:37:17 -0700
  service: 'Github Commits',
  title: 'user_id',
  body: function(data){ return 'Commit: ' + data.message },
  icon: 'http://github.com/favicon.ico',
  post_url: function(data){ return 'https://github.com' + data.url },
  template: 'linkTemplate',
  tester: function(data){ if(!(data.committer.login==data.user_name)) return false },
  type: 'code',
  user_id : 'gusher',
  user_name: 'cvn',
  user_url: 'https://github.com/USERNAME/USERID'
}


var GithubGistsParams = {
  feed_url: 'http://gist.github.com/api/v1/json/gists/USERNAME?callback=?',
  base: 'gists',
  date: 'created_at', //2011/09/06 18:37:17 -0700
  service: 'Github Gists',
  title: 'files',
  body: 'description',
  replies: function(data){ return data.comments.length },
  icon: 'http://github.com/favicon.ico',
  template: 'linkTemplate',
  type: 'code',
  post_url: function(data){ return 'https://gist.github.com/' + data.repo },
  user_name: 'cvn',
  user_url: 'https://github.com/USERNAME'
}
GithubGistsParams.comments = function(data) {
  var comments = data.comments,
      view = '';
  $.each(comments, function(i,item){
    view += '<p><b>' + this.user + ':</b> ' + this.body + '</p>';
  });
  return view;
}

var GoogleCalendarUpcomingParams = {
  feed_url: 'http://www.google.com/calendar/feeds/USERID/public/full?alt=json-in-script&max-results=LIMIT&orderby=starttime&singleevents=true&sortorder=ascending&futureevents=true&callback=?',
  base: 'feed.entry',
  tester: function(data){ if (!('gd$when' in data)) return false; },
  date: 'gd$when.0.startTime', // 2011-07-01 or 2011-07-01T12:00:00.000-07:00
  order: 'ascend',
  service: 'Google Calendar',
  title: 'title.$t',
  body: function(data){return 'Notes: ' + getProps('content.$t', data) },
  icon: 'http://calendar.google.com/googlecalendar/images/favicon.ico',
  type: 'event',
  post_icon: function(data){return 'http://calendar.google.com/googlecalendar/images/favicon_v2010_'+data.date_obj.getDate()+'.ico'},
  post_url: 'link.0.href',
  comments: function(data){return 'Location: ' + getProps('gd$where.0.valueString', data) },
  target: '#events',
  template: 'eventTemplate',
  user_id: 'n009cm93n1nvn4heto23h8h9oc@group.calendar.google.com',
  user_url: 'https://www.google.com/calendar/embed?src=USERID&ctz=America/Los_Angeles'
}
GoogleCalendarUpcomingParams.normalizer = function(str){
  if(/:/.test(str)){
    str = Date.parse(str);
  } else {
    str = str.replace(/-/g,'/');
  }
  return str;
}

var GooglePlusActivityParams = {
  feed_apikey: 'AIzaSyBwiHaQMmsTQ74bpoJcaQjtZ2GUAz4nWtk',
  feed_url: 'https://www.googleapis.com/plus/v1/people/USERID/activities/public?key=APIKEY&prettyPrint=false&maxResults=LIMIT&callback=?',
  base: 'items',
  date: 'published', //2011-09-27T17:23:30.000Z
  service: 'Google+',
  user_url: '',
  body: 'object.content',
  likes: 'object.plusoners.totalItems',
  replies: 'object.replies.totalItems',
  icon: 'https://plus.google.com/favicon.ico',
  user_id: '117597577088490503351',
  user_url: 'https://plus.google.com/USERID'
}
GooglePlusActivityParams.post_url = function(data){
  var property = getProps('url',data);
  if (typeof(data.object.attachments)!='undefined'){
    var items = data.object.attachments,
        links = 0,
        view = '';
    $.each(items, function(i,item){
      switch(this.objectType){
        case 'article':
          links++;
          view = this.url;
          break;
      }
    });
    if (links==1) {
      var property = view;
    }
  }
  return property;
}
GooglePlusActivityParams.title = function(data){
  var property = '';
  if (typeof(data.object.attachments)!='undefined'){
    var items = data.object.attachments,
        links = 0,
        view = '';
    $.each(items, function(i,item){
      switch(this.objectType){
        case 'article':
          links++;
          view = this.displayName;
          break;
      }
    });
    if (links==1) {
      var property = view;
    }
  }
  return property;
}
GooglePlusActivityParams.type = function(data){
  var property = 'thought';
  if (typeof(data.object.attachments)!='undefined'){
    var items = data.object.attachments,
        links = 0,
        photos = 0,
        videos = 0,
        view = '';
    $.each(items, function(i,item){
      switch(this.objectType){
        case 'article':
          links++;
          break;
        case 'photo':
          photos++
          break;
        case 'photo-album':
          photos++
          break;
        case 'video':
          videos++
          break;
      }
    });
    if (links==1) {
      var property = 'link';
    } else if (photos>0) {
      var property = 'photo';
    } else if (videos>0) {
      var property = 'video';
    }
  }
  return property;
}
GooglePlusActivityParams.template = function(data){
  var property = 'blogTemplate';
  if (typeof(data.object.attachments)!='undefined'){
    var items = data.object.attachments,
        links = 0,
        view = '';
    $.each(items, function(i,item){
      switch(this.objectType){
        case 'article':
          links++;
          view = 'linkTemplate';
          break;
      }
    });
    if (links==1) {
      var property = view;
    }
  }
  return property;
}
GooglePlusActivityParams.comments = function(data){
  var view = '',
      replies = data.object.replies.totalItems,
      plusones = data.object.plusoners.totalItems;
  if (typeof(data.object.attachments)!='undefined'){
    var items = data.object.attachments,
        links = 0,
        linkTitle = '';
    $.each(items, function(i,item){
      switch(this.objectType){
        case 'article':
          links++;
          view += '<p><a href="'+this.url+'">' + this.displayName + '</a></p>' + ((typeof(this.content)!='undefined') ? '<p>' + this.content + '</p>' : '');
          break;
        case 'photo':
          var url = (typeof(this.url)!='undefined') ? this.url : data.url;
          view += '<p><a href="'+url+'"><img class="photo" src="'+this.fullImage.url+'"></a></p> <p>' + ((typeof(this.displayName)!='undefined') ? this.displayName : '') + '</p>';
          break;
        case 'photo-album':
          view += '<p><a href="'+this.url+'">' + this.displayName + '</a></p>';
          break;
        case 'video':
          view += '<p><a href="'+this.url+'"><img class="photo" src="'+this.image.url+'"></a>' + this.displayName + '</p><p>' + this.content + '</p>';
          break;
      }
    });
  }
  if (replies || plusones){
    view += '<p><a href="'+data.url+'">';
    if (replies) { view += replies + ' repl' + ((replies>1) ? 'ies' : 'y') };
    if (plusones) { view += ' +' + plusones; };
    view += '</a></p>';
  }
  return view;
}

var GoogleReaderStarredParams = {
  // Non-JSONP, but full text feed: http://www.google.com/reader/api/0/stream/contents/user/USERID/state/com.google/starred	
  feed_url: 'http://www.google.com/reader/public/javascript/user/USERID/state/com.google/starred?n=LIMIT&callback=?',
  base: 'items',
  date: 'published', //1317767141
  normalizer: function(str){return str*1000},
  service: 'Google Reader',
  title: 'title',
  body: 'summary',
  icon: 'http://google.com/reader/ui/favicon.ico',
  type: 'like',
  post_url: 'alternate.href',
  template: 'quoteTemplate',
  user_name: 'chadvonnau',
  user_id: '18350608172246430560',
  user_url: 'http://www.google.com/reader/shared/USERNAME'
}
GoogleReaderStarredParams.comments = function(data) {
  var comments = data.comments,
      view = '';
  $.each(comments, function(i,item){
    view += '<p><b>' + data.author + ':</b> ' + data.content + '</p>';
  });
  return view;
}

// Instapaper (RSS)
var InstapaperStarredParams = {
  feed_type: 'RSS',
  feed_url: 'http://www.instapaper.com/starred/rss/USERID',
  base: 'responseData.feed.entries',
  date: 'publishedDate',
  service: 'Instapaper',
  title: 'title',
//body: 'content',
  icon: 'http://instapaper.com/favicon.ico',
  post_url: 'link',
  template: 'linkTemplate',
  type: 'like',
  user_id: '35521/Gm8tmRhf7rsCL1H4XGrG3L6vUQ',
  user_url: 'http://www.instapaper.com/starred/rss/USERID'
}

var LastfmFavsParams = {
  feed_apikey: '71350c6ce93a1e0c92749f023be926d7',
  feed_url: 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&format=json&api_key=APIKEY&user=USERNAME&limit=LIMIT&callback=?',
  base: 'lovedtracks.track',
  date: 'date.uts',
  normalizer: function(str){return str*1000},
  service: 'Last.fm',
  title: function(data){ return getProps('artist.name', data) + ' - ' + getProps('name', data) },
  body: function(data){ return '<img class="albumcover" src="' + getProps('image.2.#text', data) + '">' },
  icon: 'http://last.fm/favicon.ico',
  type: 'music',
  post_url: 'url',
  template: 'linkTemplate',
  user_name: 'chadnau',
  user_url: 'http://www.last.fm/user/USERNAME'
}

var LastfmActivityParams = {
  feed_apikey: '71350c6ce93a1e0c92749f023be926d7',
  feed_url: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&api_key=APIKEY&user=USERNAME&limit=LIMIT&nowplaying=false&callback=?',
  base: 'recenttracks.track',
  date: 'date.uts',
  normalizer: function(str){return str*1000},
  service: 'Last.fm',
  title: 'name',
  body: 'artist.#text',
  icon: 'http://last.fm/favicon.ico',
  post_url: 'url',
  template: 'linkTemplate',
  type: 'music',
  user_name: 'chadnau',
  user_url: 'http://www.last.fm/user/USERNAME'
}

var StackOverflowAnswersParams = {
  feed_url: 'http://api.stackoverflow.com/1.0/users/USERID/answers?body=true&comments=true&pagesize=LIMIT&jsonp=?',
  base: 'answers',
  date: 'creation_date',
  normalizer: function(str){return str*1000},
  service: 'Stack Overflow',
  title: function(data){ return 'Q: ' + data.title },
  body: 'body',
  icon: 'http://sstatic.net/stackoverflow/img/favicon.ico',
  type: 'response',
  post_url: function(data){ return 'http://stackoverflow.com' + data.answer_comments_url.replace('answers','questions') },
  user_id: '490592',
  user_url: 'http://stackoverflow.com/users/USERID'
}
StackOverflowAnswersParams.comments = function(data) {
  var comments = data.comments,
      view = '';
  $.each(comments, function(i,item){
    view += '<p><b>' + this.owner.display_name + ':</b> ' + this.body + '</p>';
  });
  return view;
}

var TumblrPostsParams = {
  feed_apikey: '0XBDS5MbfogrLBwoQKnkGjZ4Kw3ili2j3tv2goWTYj2WEZVCJZ',
  feed_url: 'http://api.tumblr.com/v2/blog/USERNAME/posts?api_key=APIKEY&limit=LIMIT&jsonp=?',
  base: 'response.posts',
  date: 'timestamp',
  normalizer: function(str){return str*1000},
  service: 'Tumblr',
  title: 'title',
  icon: 'http://assets.tumblr.com/images/favicon.gif',
  type: function(data){ return getProps('type', data) },
  post_url: 'post_url',
  user_name: 'eyeburn.info',
  user_url: function(data){ return getProps('response.blog.url', data) }
}
TumblrPostsParams.body = function(data){
  var media = '',
      content = '';
  switch(data.type) {
    case 'photo':
      var mediaLink = (data.link_url) ? data.link_url : '';
      $.each(data.photos, function(){
        $.each (this.alt_sizes, function(){
          if (this.width == 400) {
            var currentMedia = '<p><img class="photo" src="' + this.url + '"></p>';
            if (mediaLink) { currentMedia = '<a href="'+ mediaLink +'">' + currentMedia + '</a>' }
            media += currentMedia;
          }
        });
      });
      content = media + data.caption;
      break;
    case 'video':
      $.each(data.player, function(){
        if (this.width == 400) { 
          media += this.embed_code;
        }
      });
      content = media + data.caption;
      break;
    case 'text':
      content = data.body;
      break;
    case 'default':
      break;
  }
  return content;
}
TumblrPostsParams.comments = function(data){
  var content = '';
  if (data.note_count){
  	content += 'Likes: ' + data.note_count;
  }
  return content;
}

var TwitterPostsParams = {
  feed_url: 'http://api.twitter.com/1/statuses/user_timeline/USERNAME.json?include_entities=true&count=LIMIT&callback=?',
  date: 'created_at', //Mon Oct 03 20:26:38 +0000 2011
  service: 'Twitter',
//likes: 'favorited',
  icon: 'http://twitter.com/favicon.ico',
  type: 'tweet',
  post_url: function(data){ return 'http://twitter.com/' + data.user.screen_name + '/statuses/' + data.id_str },
  user_name: 'chadvonnau',
  user_url: 'http://twitter.com/USERNAME'
}
TwitterPostsParams.body = function(data){
  // function borrowed from http://140dev.com/free-twitter-api-source-code-library/twitter-display/linkify-php/
  // entities is an object delivered by the Twitter API for each tweet with 
  // the user @mentions, hastags, and URLs broken out along with their positions
 
  // Constants
  var tweet_text = data.text,
      entities = data.entities,
      user_mention_url = 'http://twitter.com/',
      user_mention_title = '';
      hashtag_url = 'http://twitter.com/search?q=',
      hashtag_title = '';
 
  // Create an array of entities with the starting point of the entity as the key 
  // This will allow the processing of the tweet in a character by character loop
  // Entities can be replaced by their hyperlink versions within this loop
  var entity_map = [];
        
  // Extract user mentions
  var user_mentions = entities.user_mentions;
  for (i in user_mentions)  {
    start = user_mentions[i].indices[0];
    entity_map[start] = {'screen_name': user_mentions[i].screen_name,
      'name' : user_mentions[i].name,
      'type' : 'user_mention' }; 
  }
        
  // Extract hashtags
  var hashtags = entities.hashtags;
  for (i in hashtags)  {
  start = hashtags[i].indices[0];
  entity_map[start] = {'text': hashtags[i].text,
    'type' : 'hashtag'};
  }
 
  // Extract media
  var media = entities.media;
  for (i in media)  {
    start = media[i].indices[0];
    entity_map[start] = {'url': media[i].url,
      'display_url': media[i].display_url,
      'expanded_url': media[i].expanded_url,
      'media_url': media[i].media_url,
      'media_type': media[i].type,
      'type' : 'media'};
  }

  // Extract URLs
  var urls = entities.urls;
  for (i in urls)  {
    start = urls[i].indices[0];
    entity_map[start] = {'url': urls[i].url,
      'display_url': urls[i].display_url,
      'expanded_url': urls[i].expanded_url,
      'type' : 'url'};
  }
 
  // Loop through the tweet text one character at a time
  var charptr = 0;
  var text_end = tweet_text.length - 1;
  // Construct a new version of the text with entities converted to links
  var new_text = '';
  while (charptr <= text_end) {
    
    // Does the current character have a matching element in the $entity_map array?
    if (typeof entity_map[charptr] != 'undefined') {
      switch (entity_map[charptr]['type']) {
        case 'user_mention':
          new_text += '<a href="' + user_mention_url + 
            entity_map[charptr]['screen_name'] + 
            '" title="' + user_mention_title +  
            entity_map[charptr]['screen_name'] + 
            ' (' + entity_map[charptr]['name'] + ')">@' + 
            entity_map[charptr]['screen_name'] + '</a> ';
          	        	
          charptr += entity_map[charptr]['screen_name'].length + 1;
          break;
          
        case 'hashtag':
          new_text += '<a href="' + hashtag_url + 
          entity_map[charptr]['text'] + 
            '" title="' + hashtag_title +  
          entity_map[charptr]['text'] + '">#' + 
            entity_map[charptr]['text'] + '</a> ';		
        
          charptr += entity_map[charptr]['text'].length + 1;
          break;
          
        case 'media':
          new_text += '<a href="';
          if (entity_map[charptr]['media_url']) {
            new_text += entity_map[charptr]['media_url'];
          } else {
            new_text += entity_map[charptr]['url'];
          }
          new_text += '">' + entity_map[charptr]['display_url'] + '</a> ';
          	    	
          charptr += entity_map[charptr]['url'].length + 1;
          break;
        
        case 'url':
          new_text += '<a href="';
          if (entity_map[charptr]['expanded_url']) {
            new_text += entity_map[charptr]['expanded_url'];
          } else {
            new_text += entity_map[charptr]['url'];
          }
          new_text += '">' + entity_map[charptr]['display_url'] + '</a> ';
          	    	
          charptr += entity_map[charptr]['url'].length + 1;
          break;
      }
    } else {
      new_text += tweet_text.substr(charptr,1);
      ++charptr;	
    }		
  }
  return '<p>' + new_text + '</p>';
}

var VimeoActivityParams = {
  feed_url: 'http://vimeo.com/api/v2/activity/USERNAME/user_did.json?callback=?',
  tester: function(data){ if (/^(?:group_clip|group_join)$/.test(data.type)) return false; },
  date: 'date',
  normalizer: function(str){return str.replace(/-/g,'/')},
  service: 'Vimeo',
//title: 'video_title',
  body: function(data){ return '<iframe src="http://player.vimeo.com/video/'+data.video_id+'?portrait=0" width="400" height="225" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe>' }, //alts: 600 x 365
  icon: 'http://vimeo.com/favicon.ico',
  type: function(data){ return data.type },
  post_url: 'video_url',
  user_name: 'chadvonnau',
  user_url: 'http://vimeo.com/USERNAME'
}
VimeoActivityParams.comments = function(data){
  var content = '';
  switch(data.type) {
    case 'add_tags':
      content = '<p><b>Tagged:</b> ' + data.action_tags + '</p>';
      break;
    case 'add_comment':
      content = '<p><b>Said:</b> ' + data.comment_text + '</p>';
      break;
    case 'like':
      break;
    case 'default':
      break;
  }
  return '<p>' + content + '</p>';
}

var YouTubeFavoritesParams = {
  feed_url: 'https://gdata.youtube.com/feeds/api/users/USERNAME/favorites?v=2&alt=jsonc&format=5&max-results=LIMIT&callback=?',
  base: 'data.items',
  date: 'created',
  normalizer: function(str){return str.replace(/-/g,'/').replace(/[TZ]/g,' ').replace(/\.000/g,'')},
  service: 'YouTube',
  title: 'title',
  body: function(data){ return '<iframe width="400" height="255" src="http://www.youtube.com/embed/' + data.video.id + '?wmode=opaque" frameborder="0" allowfullscreen></iframe>' }, //'<p>' + data.video.description + '</p>'
  icon: 'http://www.youtube.com/favicon.ico',
  type: 'like',
  post_url: 'video.player.default',
  user_name: 'chadvonnau',
  user_url: 'http://www.youtube.com/USERNAME'
}
