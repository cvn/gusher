var mongo = require('mongodb');
var Db = mongo.Db
  , Connection = mongo.Connection
  , Server = mongo.Server
  , BSON = mongo.BSON
  , ObjectID = mongo.ObjectID;

var streamCounter = 1;

StreamProvider = function(host, port){
  this.db = new Db('gusherdb', new Server(host, port, {autoreconnect: true}, {}));
  this.db.open(function(){});
};

StreamProvider.prototype.getCollection = function(callback){
  this.db.collection('streams', function(error, stream_collection){
    if(error) callback(error);
    else callback(null, stream_collection);
  })
}

StreamProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, stream_collection){
    if(error) callback(error);
    else {
      stream_collection.find().toArray(function(error, results){
        if(error) callback(error);
        else callback(null, results);
      });
    }
  });
}

StreamProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, stream_collection) {
    if(error) callback(error);
    else {
      stream_collection.findOne({_id: stream_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if(error) callback(error);
        else callback(null, result);
      });
    }
  });
}

StreamProvider.prototype.findByName = function(name, callback) {
  this.getCollection(function(error, stream_collection) {
    if(error) callback(error);
    else {
      stream_collection.findOne({name: name}, function(error, result) {
        if(error) callback(error);
        else callback(null, result);
      });
    }
  });
}

StreamProvider.prototype.removeById = function(id, callback) {
  this.getCollection(function(error, stream_collection) {
    if(error) callback(error);
    else {
      stream_collection.remove({_id: stream_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if(error) callback(error);
        else callback(null, result);
      });
    }
  });
}

StreamProvider.prototype.save = function(streams, callback) {
  this.getCollection(function(error, stream_collection) {
    if(error) callback(error);
    else {
      if (typeof(streams.length)=='undefined')
        streams = [streams];
      
      for(var i=0; i<streams.length; i++) {
        stream = streams[i];
        stream.created_at = new Date();
        if(stream.feeds === undefined) stream.feeds = [];
        for(var j=0; j<stream.feeds.length; j++) {
          stream.feeds[j].created_at = new Date();
        }
      }
      stream_collection.insert(streams, function(){
        callback(null, streams);
      })
    }
  });
}

StreamProvider.prototype.addFeed = function(streamName, feed, callback){
  this.getCollection(function(error, stream_collection){
    if(error) callback(error);
    else {
      feed.timestamp = Date.now();
      feed.created_at = new Date();
      stream_collection.update(
        {name: streamName},
        {'$push': {feeds: feed}},
        function(error, stream){
          if(error) callback(error);
          else callback(null, stream);
        }
      )
    }
  });
}

StreamProvider.prototype.removeFeed = function(streamName, timeStamp, callback){
  this.getCollection(function(error, stream_collection){
    if(error) callback(error);
    else {
      stream_collection.update(
        {name: streamName},
        {'$pull': {feeds: {timestamp: timeStamp}}},
        function(error, stream){
          if(error) callback(error);
          else callback(null, stream);
        }
      )
    }
  });
}

/* Eligible for deletion
StreamProvider.prototype.addFeeds = function(streamName, feeds, callback){
  this.getCollection(function(error, stream_collection){
    if(error) callback(error);
    else {
      if (typeof(feeds.length)=='undefined')
        feeds = [feeds];
      for(var i=0; i<feeds.length; i++) {
        feed = feeds[i];
        feed.created_at = new Date();
      }
      stream_collection.update(
        {name: streamName},
        {'$pushAll': {feeds: feeds}},
        function(error, stream){
          if(error) callback(error);
          else callback(null, stream);
        }
      )
    }
  });
}
*/

exports.StreamProvider = StreamProvider;
