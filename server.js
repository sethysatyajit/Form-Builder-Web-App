const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data file path
const dataPath = path.join(__dirname, 'data', 'submissions.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(dataPath))) {
  fs.mkdirSync(path.dirname(dataPath));
}
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ forms: [] }));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Get all forms
app.get('/forms', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data' });
    }
    res.json(JSON.parse(data));
  });
});

// Save a form
app.post('/forms', (req, res) => {
  const formData = req.body;
  formData.id = uuidv4();
  formData.createdAt = new Date().toISOString();
  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data' });
    }
    
    const jsonData = JSON.parse(data);
    jsonData.forms.push(formData);
    
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving data' });
      }
      res.json({ message: 'Form saved successfully', formId: formData.id });
    });
  });
});

// Submit form response
app.post('/submit/:formId', (req, res) => {
  const formId = req.params.formId;
  const submission = req.body;
  submission.id = uuidv4();
  submission.submittedAt = new Date().toISOString();
  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data' });
    }
    
    const jsonData = JSON.parse(data);
    const formIndex = jsonData.forms.findIndex(form => form.id === formId);
    
    if (formIndex === -1) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    if (!jsonData.forms[formIndex].submissions) {
      jsonData.forms[formIndex].submissions = [];
    }
    
    jsonData.forms[formIndex].submissions.push(submission);
    
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving submission' });
      }
      res.json({ message: 'Response submitted successfully' });
    });
  });
});

// Get form by ID
app.get('/forms/:formId', (req, res) => {
  const formId = req.params.formId;
  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data' });
    }
    
    const jsonData = JSON.parse(data);
    const form = jsonData.forms.find(form => form.id === formId);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json(form);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the app`);
});