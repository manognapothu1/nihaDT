const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdminUser = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env');
      return;
    }

    const existing = await User.findOne({ email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name: 'Admin', email, password: hashedPassword, role: 'admin' });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Admin setup failed:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await createAdminUser();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
