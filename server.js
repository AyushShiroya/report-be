const app = require('./app');
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
