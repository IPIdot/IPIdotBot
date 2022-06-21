const { Sequelize } = require('sequelize');
const { DEBUG_MODE } = require('./config.json');
const puppeteer = require("puppeteer");

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

const htmlToImage = async (_html) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.setContent(_html);

  const content = await page.$("#content");
  const image = await content.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();

  return image;
}

// ############### Module Exports area #############

module.exports.DB = sequelize;
module.exports.DB_TEST_CONNEXION = test_db_connexion;
module.exports.dump = dump;
module.exports.htmlToImage = htmlToImage;
module.exports.SERVER_TIMEZONE = "CET";
module.exports.EDT_BASE_URL = "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=G";
module.exports.RESOURCES = {
  PATH: {
    CALENDAR: {
      PNG: {
        L3: "./assets/calendar/png/Calendar_IPI_Digitalents_L3_2020_2021.png",
        M1: "./assets/calendar/png/Calendar_IPI_Digitalents_M1_2021_2022.png",
        M2: "./assets/calendar/png/Calendar_IPI_Digitalents_M2_2022_2023.png"
      },
      PDF: {
        L3: "./assets/calendar/pdf/Calendar_IPI_Digitalents_L3_2020_2021.pdf",
        M1: "./assets/calendar/pdf/Calendar_IPI_Digitalents_M1_2021_2022.pdf",
        M2: "./assets/calendar/pdf/Calendar_IPI_Digitalents_M2_2022_2023.pdf"
      }
    },
    LOGO: {
      WITHOUTTYPO: "./assets/logo/logoIPITypo.png",
      WITHTYPO: "./assets/logo/logoIPI.png"
    }
  },
  URL: {
    BEECOME: "https://www.beecome.io/dashboard",
    PORTAL: "https://apprenant.ipi-lyon.info/"
  }
};

// ############### END ###############
