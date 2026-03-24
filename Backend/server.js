const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = require('./src/app.js');
const PORT = 3000 || process.env.PORT

app.use(cors({ origin: process.env.CLIENT_URL }))

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
// console.log("API KEY:", process.env.GOOGLE_GEMINI_KEY);