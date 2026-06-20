const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'car_management_secret_key_2024';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Data Storage (JSON file-based) ──────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CARS_FILE = path.join(DATA_DIR, 'cars.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const readJSON = (file) => {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
};

const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ─── Multer Config ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
const swaggerDoc = {
  openapi: '3.0.0',
  info: { title: 'Car Management API', version: '1.0.0', description: 'API for managing cars with user authentication' },
  servers: [{ url: `http://localhost:${PORT}`, description: 'Local server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' }, username: { type: 'string' }, email: { type: 'string' }, createdAt: { type: 'string' }
        }
      },
      Car: {
        type: 'object',
        properties: {
          id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' },
          tags: { type: 'object', properties: { car_type: { type: 'string' }, company: { type: 'string' }, dealer: { type: 'string' } } },
          images: { type: 'array', items: { type: 'string' } },
          userId: { type: 'string' }, createdAt: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/api/auth/signup': {
      post: {
        tags: ['Auth'], summary: 'Register a new user',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'email', 'password'], properties: { username: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 201: { description: 'User created' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login and get JWT token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Login successful, returns token' }, 401: { description: 'Invalid credentials' } }
      }
    },
    '/api/cars': {
      get: {
        tags: ['Cars'], summary: 'List all cars for logged-in user (supports search)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by title, description, or tags' }],
        responses: { 200: { description: 'Array of cars' } }
      },
      post: {
        tags: ['Cars'], summary: 'Create a new car (up to 10 images)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, car_type: { type: 'string' }, company: { type: 'string' }, dealer: { type: 'string' }, images: { type: 'array', items: { type: 'string', format: 'binary' } } } } } } },
        responses: { 201: { description: 'Car created' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/cars/{id}': {
      get: {
        tags: ['Cars'], summary: 'Get a particular car by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Car details' }, 404: { description: 'Car not found' } }
      },
      put: {
        tags: ['Cars'], summary: 'Update a car',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, car_type: { type: 'string' }, company: { type: 'string' }, dealer: { type: 'string' }, images: { type: 'array', items: { type: 'string', format: 'binary' } } } } } } },
        responses: { 200: { description: 'Car updated' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } }
      },
      delete: {
        tags: ['Cars'], summary: 'Delete a car',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Car deleted' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } }
      }
    }
  }
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get('/api/docs-json', (req, res) => res.json(swaggerDoc));

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already in use' });
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Username already taken' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), username, email, password: hashedPassword, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ message: 'User created', token, user: { id: user.id, username, email } });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });
});

// ─── CAR ROUTES ───────────────────────────────────────────────────────────────
// GET /api/cars - List all cars (with optional search)
app.get('/api/cars', authenticate, (req, res) => {
  const { search } = req.query;
  let cars = readJSON(CARS_FILE).filter(c => c.userId === req.user.id);

  if (search) {
    const q = search.toLowerCase();
    cars = cars.filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      Object.values(c.tags || {}).some(v => v?.toLowerCase().includes(q))
    );
  }

  res.json({ cars, count: cars.length });
});

// POST /api/cars - Create car
app.post('/api/cars', authenticate, upload.array('images', 10), (req, res) => {
  const { title, description, car_type, company, dealer } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const images = (req.files || []).map(f => `/uploads/${f.filename}`);
  const car = {
    id: uuidv4(),
    title,
    description: description || '',
    tags: { car_type: car_type || '', company: company || '', dealer: dealer || '' },
    images,
    userId: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const cars = readJSON(CARS_FILE);
  cars.push(car);
  writeJSON(CARS_FILE, cars);
  res.status(201).json({ message: 'Car created', car });
});

// GET /api/cars/:id - Get single car
app.get('/api/cars/:id', authenticate, (req, res) => {
  const cars = readJSON(CARS_FILE);
  const car = cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  if (car.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  res.json({ car });
});

// PUT /api/cars/:id - Update car
app.put('/api/cars/:id', authenticate, upload.array('images', 10), (req, res) => {
  const cars = readJSON(CARS_FILE);
  const idx = cars.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Car not found' });
  if (cars[idx].userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const { title, description, car_type, company, dealer, remove_images } = req.body;
  const car = cars[idx];

  // Remove selected old images
  let currentImages = car.images || [];
  if (remove_images) {
    const toRemove = Array.isArray(remove_images) ? remove_images : [remove_images];
    toRemove.forEach(imgPath => {
      const fullPath = path.join(__dirname, imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });
    currentImages = currentImages.filter(img => !toRemove.includes(img));
  }

  // Add new images (enforce max 10)
  const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
  const allImages = [...currentImages, ...newImages].slice(0, 10);

  cars[idx] = {
    ...car,
    title: title || car.title,
    description: description !== undefined ? description : car.description,
    tags: {
      car_type: car_type !== undefined ? car_type : car.tags?.car_type,
      company: company !== undefined ? company : car.tags?.company,
      dealer: dealer !== undefined ? dealer : car.tags?.dealer
    },
    images: allImages,
    updatedAt: new Date().toISOString()
  };

  writeJSON(CARS_FILE, cars);
  res.json({ message: 'Car updated', car: cars[idx] });
});

// DELETE /api/cars/:id - Delete car
app.delete('/api/cars/:id', authenticate, (req, res) => {
  const cars = readJSON(CARS_FILE);
  const idx = cars.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Car not found' });
  if (cars[idx].userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  // Delete image files
  (cars[idx].images || []).forEach(imgPath => {
    const fullPath = path.join(__dirname, imgPath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  });

  cars.splice(idx, 1);
  writeJSON(CARS_FILE, cars);
  res.json({ message: 'Car deleted' });
});

// ─── Catch-all → SPA ─────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗 Car Management App running at http://localhost:${PORT}`);
  console.log(`📚 API Docs at http://localhost:${PORT}/api/docs\n`);
});
