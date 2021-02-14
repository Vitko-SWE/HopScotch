var mysql = require('mysql');

var mysql  = mysql.createConnection({
    host            : 'tuffin.abderus.dreamhost.com',
    user            : 'hopscotchuser',
    password        : 'Hunter123',
    database        : 'hopscotch'
  });
  
  mysql.connect(function(err) {
      
      if (err) throw err;
      
      else {
          console.log('DB connection successful');
      }
  })
