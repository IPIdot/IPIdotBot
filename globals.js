const { Sequelize } = require('sequelize');
const { DEBUG_MODE } = require('./config.json');

// ############### DB IMPLEMENTATION ###############

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/db.sqlite',
  logging: DEBUG_MODE ? console.log : !DEBUG_MODE
});

// ========== Database utils ==========

const test_db_connexion = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// ========== Database memo ==========

// Create Instance : const jane = User.build({ name: "Jane" });
// Save Instance : await jane.save();
// Create and save : const jane = await User.create({ name: "Jane" });
// Delete Instance : await jane.destroy();
// Reload Instance as in DB : await jane.reload();

// ############### END ###############

const dump = (_object, _title = null) => {
  if (_title) console.log(_title);
  console.log(JSON.stringify(_object, null, 2));
}

// ############### Module Exports area #############

module.exports.DB = sequelize;
module.exports.DB_TEST_CONNEXION = test_db_connexion;
module.exports.dump = dump;
module.exports.EDT_BASE_URL = "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=G";
module.exports.CALENDRIER_ALTERNANCE_L = "./assets/CalAlt.png";
module.exports.CALENDRIER_ALTERNANCE_M1 = "PATH";
module.exports.CALENDRIER_ALTERNANCE_M2 = "PATH";

// ############### END ###############
