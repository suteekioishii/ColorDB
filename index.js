//テスト用のデータ
var testDB =[
  {user:"eggGirl", message:"初めて片手で卵を割ることができ、エッグマスターになった！"},
  {user:"coffeeBoy", message:"コーヒーだけを飲み過ぎると尿路結石ができるらしい…。適度に水を飲もうね。"},
  {user:"忍者U", message:"水遁の術とは水中に身を隠す術だ！都会の生活排水で汚れ切った川の中に飛び込むのは並大抵の気持ちでは無理だ。"},
  {user:"_0x0_", message:"タンバリンがあるカラオケってもうないの？？"},
  {user:"起床endless", message:"今日は良い天気だったので散歩をした。美味しいクッキー屋さんを見つけた。"}
];

const Sequelize = require('sequelize');
let DB_INFO = "postgres://colormemory:myPostgres@postgres:5432/colormemory";
let pg_option = {};

if (process.env.DATABASE_URL) {
  DB_INFO = process.env.DATABASE_URL;
  pg_option = { ssl: { rejectUnauthorized: false } };
}

const sequelize = new Sequelize(DB_INFO,
  {
    dialect: 'postgres',
    dialectOptions: pg_option
  });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((mes) => {
    console.log('Unable to connect to the database:', mes);
  });

const MessagesDB = sequelize.define('messages',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username: Sequelize.TEXT,
    message: Sequelize.TEXT
  },
  {
    // timestamps: false,      // disable the default timestamps
    freezeTableName: true   // stick to the table name we defined
  });


for (const e of testDB) {
  sequelize.sync({ force: false, alter: true })
  .then(addMessage(e["user"],e["message"]))
  .catch((mes) => {
    console.log("db connection error", mes);
  });
  console.log(e);
}
    

function addMessage(user,message) {
  console.log("db connection succeeded");
  let newMessage = new MessagesDB(
    {
      username: user,
      message: message
    }
    
  );

  newMessage.save()
    .then((mes) => {
      console.log(mes.dataValues);
    })
    .catch((err) => {
      console.log("db save error", err);
    });
}