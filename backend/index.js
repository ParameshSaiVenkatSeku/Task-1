const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key';
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// credentials : {
//   Email, 
//   Password
// };

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@1234',
  database: 'test_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if(name.length > 2) {
    if((regex).test(email) === true) {
      if(password.length > 7) {
        if(confirmPassword === password) {  
          const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
          db.query(sql, [name, email, hashedPassword], (err) => {
            if (err) {
              console.error('Error inserting user:', err);
              res.status(500).send('Error registering user');
            } else {
              res.status(200).json({ message: 'User registered successfully' });
            }
          });
        }
        else {
          res.status(400).json({ message: 'Passwords does not match!' });  
        }
      }
      else {
        res.status(400).json({ message: 'Password should contain atleast 8 characters!' });  
      }
    }
    else {
      res.status(400).json({ message: 'Not a valid email!' });
    }
  }
  else {
    res.status(400).json({ message: 'Name cannot be empty!' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  Email = email;
  Password = password;
  if(regex.test(email)) {
    if(password.length > 7) {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], (err, result) => {
        if (err) {
          console.error('Error querying database:', err);
          res.status(500).send('Server error');
        } else if (result.length > 0) {
          const user = result[0];
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ token, message: 'User login successful' });
          } else {
            res.status(400).json({ message: 'Invalid credentials' });
          }
        } else {
          res.status(400).json({ message: 'Invalid credentials' });
        }
      });
    }
    else {
      res.status(400).json({ message: 'Password should contain atleast 8 characters!' });
    }
  }
  else {
    res.status(400).json({ message: 'Not a vaild email!' });
  }
});

// app.get('/user', (req, res) => {
//   res.status(200).send(credentials);
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});