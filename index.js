const express = require('express');
const config = require('./helpers/config');
const app = express();

app.use('/views', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',  (req, res) => {
  res.redirect('views/index.html');
});
app.use('/',require('./controllers'));

app.listen(config.port, ()=> {
  console.log('PushCart server running on port 3000...');
});