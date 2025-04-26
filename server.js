const app = require('./app');
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
