const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = require('./src/app.js');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
// console.log("API KEY:", process.env.GOOGLE_GEMINI_KEY);