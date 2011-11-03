// Below line was recommended by one tutorial, commented out for now
// require.paths.push('/home/chadvonnau/lib/node_modules');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , StreamProvider = require('./streamprovider').StreamProvider

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// App code

var streamProvider = new StreamProvider('localhost', 14633);

var formatDate = function(dateObj){
  dateObj = dateObj || new Date();
  var dayname = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      monthname = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  var dn = dayname[dateObj.getDay()],
      d  = dateObj.getDate(),
      mn = monthname[dateObj.getMonth()],
      y = dateObj.getYear();
  if(y < 1000) y+=1900;
  return dn + ', ' + d + ' ' + mn + ' ' + y; //equivalent to dateObj.strftime('%A, %e %B %Y');
}


// Routes

app.get('/stream/new', function(req, res) {
  res.render('stream_new', { locals: {
    title: 'new stream'
  }
  });
});

app.post('/stream/new', function(req, res) {
  streamProvider.save({
    name: req.param('name'),
    title: req.param('title')
  }, function(error, docs) {
    res.redirect('/'+req.param('name'));
  })
});

app.post('/stream/delete', function(req, res) {
  streamProvider.removeById(req.param('_id'), function(error, docs) {
    res.redirect('/');
  })
});

app.post('/stream/addfeed', function(req, res) {
  streamProvider.addFeed(req.param('targetstream'), {
      type: req.param('type'),
      user_name: req.param('user_name'),
      user_id: req.param('user_id'),
      created_at: new Date()
    }, function(error, docs) {
      var result = JSON.stringify({
        params: req.param('type')+ 'Params',
        user_name: req.param('user_name'),
        user_id: req.param('user_id')
      });
      res.send(result);
      //res.redirect('/' + req.param('targetstream'))
    }
  );
});

app.post('/stream/removefeed', function(req, res) {
  streamProvider.removeFeed(req.param('targetstream'), +req.param('timestamp'), function(error, docs) {
      res.send('success');
    }
  );
});


app.get('/:name', function(req, res) {
  streamProvider.findByName(req.params.name, function(error, stream) {
    stream.created_at = formatDate(new Date(stream.created_at));
    res.render('stream_show', { locals: {
      title: stream.name,
      stream: stream
    }
    });
  });
});

//app.get('/', routes.index);
app.get('/', function(req, res){
  streamProvider.findAll(function(error, docs){
    res.render('index', { locals: {
      title: 'gusher',
      streams: docs
      }
    });
  });
});

app.listen(11231);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
