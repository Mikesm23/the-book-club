const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const session = require("express-session")
const mongo = require("connect-mongo")
const User = require('../models/User.model')
const Book = require('../models/Book.model')
const saltRounds = 10

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* Sign In page */
/* GET View Homepage(with Sign In form*/
router.get("/login", (req, res) => {
  res.render("auth/login");
});

/* POST Login User */
router.post('/login', (req, res, next) => {
  //console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.password)) {
        console.log(user, "this is my user")
        req.session.currentUser = user
        res.redirect('/profile');  
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error))
});

/*router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user-profile", { user: req.session.currentUser });
});*/

/* Signup page */
/* GET View Signup Form */
router.get("/signup", (req, res) => {
    res.render("signup");
  });

/* POST Create User */
router.post("/signup", (req, res, next) => {

  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);

    })
    .then( () => {
      res.redirect('/login');
    })
    .catch(error => {
      if (error.code === 11000) {
        res.status(500).render('signup', {
          errorMessage: 'Username or Email already taken.'
        });
      } else {
        next(error);
      }
    });
});


/* Profile Page */
/* GET View Profile Page */
router.get("/profile", (req, res) => {
    res.render("auth/profile", { user: req.session.currentUser });
  });

  /* GET View Update Profile Page*/
router.get('/update-profile/:id', (req, res) => {
    User.findById(req.params.id)
    .then ((toUpdateUser) => {
      console.log(toUpdateUser)
      res.render('auth/update-profile', {toUpdateUser})
    })
  });

/* POST Update Profile/User - NOT MVP Not adjusted yet!!   */
router.post('/update-profile/:userId', async (req, res) => {   // create userId?
  try {
    console.log("editing profile-function opens!!!");
    const {username, email, password, firstName, lastName, favoriteBook, books} = req.body; 
    const {userId} = req.params
    const updatedUser = await User.findByIdAndUpdate(userId, {username, email, password, firstName, lastName, favoriteBook, books}, {new: true})
    
    res.redirect(`/profile`); // /${updatedUser._id}
  } catch (error){
      console.log ("Updating the profile in the database failed", (error))
    }
})

router.post('/edit-book/:bookId', async (req, res) => { 
  try {
    console.log("editing function opens!!!")
      const {title, author, genre, bookCover, plot, isbn} = req.body;
      const {bookId} = req.params
      const updatedBook = await Book.findByIdAndUpdate(bookId, {title, author, genre, plot, isbn}, {new: true})
       res.redirect(`/book-details/${updatedBook._id}`);
  } catch (error){
      console.log ("Updating a book in the database failed", (error))
     }
    })

/* POST Delete Profile/User */ // Doubt about the path
router.post('/auth/:id', (req, res, next) => {
  console.log("CHECK HERE PARAMS ----->", req.params)
  User.findByIdAndDelete(req.params.id)
  .then (() => {
    res.redirect('/')
  })
});


/* Create-book Page */
/* GET View Create-book Form */
router.get("/create-book", (req, res) => {
    res.render("auth/create-book");
  });
  
/* POST Create New Book -- including a redirection to the books detail page*/

router.post('/create-book', async (req, res) => {
try {
  console.log(req.body)
  const {title, author, genre, bookCover, plot, isbn} = req.body;

const newBook = await Book.create({title, author, genre, bookCover, plot, isbn})
//.then(dbPost => {
// return User.findByIdAndUpdate(author, { $push: { books: books._id } }); // newly added for db reference!
res.redirect(`/book-details/${newBook._id}`);

} catch (error){
console.log ("Creating and storing a book in the database failed", (error))
}
}) 

/* Book details page */
/* GET Route - View Book */
router.get("/book-details/:id", (req, res) => {
 Book.findById(req.params.id)
 .then ((detailsBooks) => {
  console.log(detailsBooks, "here");
  res.render('auth/book-details', {detailsBooks})
})
.catch((err) => {
    console.error("Error viewing Details: ", err);
  })
});

/* Get Route - Update Book */
router.get('/edit-book/:id', (req, res) => {
  Book.findById(req.params.id)
  .then ((toUpdateBook) => {
    console.log(toUpdateBook)
    res.render('auth/edit-book', {toUpdateBook})
  })
});

router.post('/edit-book/:bookId', async (req, res) => { 
  try {
    console.log("editing function opens!!!")
      const {title, author, genre, bookCover, plot, isbn} = req.body;
      const {bookId} = req.params
      const updatedBook = await Book.findByIdAndUpdate(bookId, {title, author, genre, plot, isbn}, {new: true})
       res.redirect(`/book-details/${updatedBook._id}`);
  } catch (error){
      console.log ("Updating a book in the database failed", (error))
     }
    })

/* Books List Page */
/* GET Route - View Book List */
router.get('/books-list', (req, res, next) => {
 Book.find()
  .then ((listBooks) => {
    res.render('auth/books-list', {listBooks})
  })
});

/*  ADMIN                 */
/* POST ROUTE - Edit books from books list */
/* DELETE Route - books list*/
/* DELETE Route - books list -- comment section*/


module.exports = router;
