



  const express = require('express');
  const bodyParser = require('body-parser');
  const pg = require('pg');
  const app = express();
  const exphbs  = require('express-handlebars');
  const Sequelize = require('sequelize');
  
  
  
  // set up sequelize to point to our postgres database
  var sequelize = new Sequelize('spzacewd', 'spzacewd', 'WVPpfL1Ev3PkDzLGBpGIB3j7DyfvZIFL', {
      host: 'hansken.db.elephantsql.com',
      dialect: 'postgres',
      port: 5432,
      dialectOptions: {
          ssl: { rejectUnauthorized: false }
      },
      query: { raw: true }
  });
  
  var Project = sequelize.define('Userss', {
      id:{
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true 
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
  });
  
  // Load styles from public folder
  app.use(express.static("./public/"));
  
  // Define a custom Handlebars helper function to format dates
  const hbs = exphbs.create({
      helpers: {
          formatDate: function (date) {
              return date.toLocaleDateString();
          }
      },
      extname:".hbs"
  });
  
  // Register handlebars as the rendering engine for views
  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");
  
  
  // Use body-parser middleware to parse incoming form data
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // Serve the HTML form
  app.get('/update-user', (req, res) => {
  
      const id = req.query.id;
  
      sequelize.sync().then(function () {
          Project.findAll({ 
              where: {
                  id: id
              }
          }).then(function(data){
              res.render('edit', { users: data[0], layout:false });
          });
      
      });
      
  });
  
  // Update user data in database
  app.post('/update-user', (req, res) => {
      /*---------------------------------------
      [TODO] Please complete the implementation
      to be able to update users in PostgreSQL.
      Receving three parameters id, name and email
  
      Using the query:
      "UPDATE users SET name = $1, email = $2 WHERE id = $3"
  
      If Failed: Return status code 500 and JSON message:
      {message: "Error Updating data into PostgreSQL"}
  
      If succeed:
      Redirect to root of the website.
      ----------------------------------------*/
  
      const name = req.body.name;
      const id = req.body.id;
      const email = req.body.email;
  
          sequelize.sync().then(function () {
              Project.update({
                  name: name,
                  email: email
              }, {
                  where: { id: id }
              }).then(function () { 
                  res.redirect("/");
              });
          
          });
  
    });
  
  // Delete user data in database
  app.get('/delete-user', (req, res) => {
      /*---------------------------------------
      [TODO] Please complete the implementation
      to be able to delete users in PostgreSQL.
      Receving on paramter id
  
      Using the query:
      "DELETE FROM users WHERE id = $1"
  
      If Failed: Return status code 500 and JSON message:
      {message: "Error Delete data from PostgreSQL"}
  
      If succeed:
      Redirect to root of the website.
      ----------------------------------------*/
  
      
      const id = req.query.id;
      sequelize.sync().then(function () {
  
          // remove User 3 from the database
          Project.destroy({
              where: { id: id } // only remove user with id == 3
          }).then(function () { 
              res.redirect("/");
          });
      
      });
  
  
    });
  
  // Handle form submission
  app.post('/insert-user', (req, res) => {
      const { name, email } = req.body;
          sequelize.sync().then(function () {
  
              // create a new "Project" and add it to the database
              Project.create({
                  name: name,
                  email: email
              }).then(function (project) {
                  res.redirect("/");
              }).catch(function (error) {
                  console.log("something went wrong!");
              });
          });
  });
  
  
  app.get('/', (req, res) => {
      sequelize.sync().then(function () {
          // return all first names only
          Project.findAll({ }).then(function(data){        
              res.render('index', { users: data, layout:false });
          });
      });
  });
  
  
  // Start the server
  app.listen(5000, () => {
      console.log('Server started on http://localhost:5000');
  });