const { app } = require('./app');
const { initModels } = require('./models/Init_Models');

const { DataBase } = require('./utils/dataBase');

//--------------- Authenticate database credentials -------------------
DataBase.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch(err => console.log(err));

//---------------- establish models relations -------------------------
initModels();

//---------------- Sync sequelize models ---------------------------------
DataBase.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

//----------------- Spin up server -------------------------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
