var express = require('express');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var serveIndex = require('serve-index')
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload());

function MessageStorage () {
  const allMessages = [];
  return {
    find: function (conditions, callback) {
      const filter = allMessages.filter(element => {
        return Object.keys(conditions).map(key => {
          return element.hasOwnProperty(key) && element.key === conditions[key]
        }).filter(e => e).length === Object.keys(conditions).length
      })
      callback('', filter)
    },
    save: function (name, message) {
      allMessages.push({
        name, message
      })
    }

  }
}

var Message = MessageStorage();

// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/files', express.static(path.join(__dirname, 'upload')), serveIndex(path.join(__dirname, 'upload'), {'icons': true}))

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', async (req, res) => {
  try{

    Message.save(req.body.name, req.body.message)
      console.log('saved');

    // var censored = await Message.findOne({message:'badword'});
    //   if(censored)
    //     await Message.remove({_id: censored.id})
    //   else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/upload/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});



io.on('connection', () =>{
  console.log('a user is connected')
})



var server = http.listen(3000, '192.168.2.107', () => {
  console.log('server is running on port', server.address().port);
});
