const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const dbName = 'test';


app.use(express.json());
app.use(bodyParser.json());


const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017';

mongoose
  .connect(`${mongoUrl}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connexion à la base de données réussie');
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à la base de données', error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, 
});

const User = mongoose.model('User', userSchema);

// GET - Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
    User.find({})
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
        res.status(500).send('Une erreur est survenue lors de la récupération des utilisateurs');
      });
  });

  app.get('/users/:email', (req, res) => {
    const userEmail = req.params.email;
    User.find({ email: userEmail })
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
        res.status(500).send('Une erreur est survenue lors de la récupération des utilisateurs');
      });
  });


// POST - Créer un nouvel utilisateur
app.post('/users', (req, res) => {
    const newUser = req.body;
    User.create(newUser)
      .then(() => {
        res.send('Utilisateur créé avec succès');
      })
      .catch((err) => {
        console.error('Erreur lors de la création de l\'utilisateur', err);
        res.status(500).send('Une erreur est survenue lors de la création de l\'utilisateur');
      });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
  
    try {
      const user = await User.findOne({ email, password }).exec();
  
      if (user) {
        res.json({ success: true, message: 'Utilisateur connecté avec succès' });
      } else {
        res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur' });
    }
});

// PUT - Mettre à jour le nom d'un utilisateur
app.put('/update/:email', (req, res) => {
  const emailUtilisateur = req.params.email;
  const NewName = req.body.name;

  User.findOneAndUpdate({ email: emailUtilisateur }, { name: NewName }, { new: true })
    .then((utilisateur) => {
      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
      return res.status(200).json({ message: "Nom de l'utilisateur mis à jour avec succès !!"});
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du nom', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du nom' });
    });
});

app.delete('/delete/:email', (req, res) => {
  const emailUtilisateur = req.params.email;

  User.findOneAndDelete({ email: emailUtilisateur })
  .then((utilisateur) => {
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.status(200).json({ message: "Utilisateur supprimé avec succès !!"});

  })
  .catch((err) => {
    console.error('Erreur lors de la suppression de l\'utilisateur', err);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  });
});



  
// // PUT - Mettre à jour un utilisateur
// app.put('/users/:id', (req, res) => {
//   const userId = req.params.id;
//   const updatedUser = req.body;
//   User.findByIdAndUpdate(userId, updatedUser, (err) => {
//     if (err) {
//       console.error('Erreur lors de la mise à jour de l\'utilisateur', err);
//       res.status(500).send('Une erreur est survenue lors de la mise à jour de l\'utilisateur');
//       return;
//     }
//     res.send('Utilisateur mis à jour avec succès');
//   });
// });

// DELETE - Supprimer un utilisateur
// app.delete('/users/:id', (req, res) => {
//   const userId = req.params.id;
//   User.findByIdAndDelete(userId, (err) => {
//     if (err) {
//       console.error('Erreur lors de la suppression de l\'utilisateur', err);
//       res.status(500).send('Une erreur est survenue lors de la suppression de l\'utilisateur');
//       return;
//     }
//     res.send('Utilisateur supprimé avec succès');
//   });
// });