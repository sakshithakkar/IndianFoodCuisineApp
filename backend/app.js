const express = require('express');
const cors = require('cors');
const dishRoutes = require('./routes/dishRoutes');
const authRoutes = require('./routes/authRoutes');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('dotenv').config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/', dishRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
