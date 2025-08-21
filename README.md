# Form Builder App

A responsive **Form Builder Web App** that allows users to create, manage, and share custom forms, similar to Google Forms. Built with **Node.js, Express, and Vanilla JavaScript**, this project provides a drag-and-drop form builder interface, a backend for storing data, and a dashboard for managing responses.

## 🚀 Features

- **Drag-and-drop form builder** – Create custom forms with text inputs, checkboxes, dropdowns, radio buttons, and more.  
- **Form preview & shareable links** – Preview forms before saving and generate links for sharing.  
- **Responsive design** – Works seamlessly across desktop and mobile devices.  
- **Dashboard** – View created forms, manage submissions, and track response statistics.  
- **Custom styling & animations** – Smooth UI with modern CSS and animation effects.  
- **Data persistence** – Forms and responses are stored in `submissions.json`.  

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript  
- **Backend:** Node.js, Express  
- **Database (local storage):** JSON file (`submissions.json`)  
- **Dependencies:**  
  - express  
  - body-parser  
  - cors  
  - uuid  
  - nodemon (dev dependency)  

## 📂 Project Structure

```
├── server.js           # Express server
├── package.json        # Dependencies & scripts
├── public/             # Static frontend files
│   ├── index.html      # Main form builder page
│   ├── form.html       # Form rendering & submission page
│   ├── css/            # Styles (style.css, animations.css)
│   ├── js/             # JavaScript files (main.js, form-builder.js, dashboard.js)
├── data/
│   └── submissions.json # Stores forms & responses
```

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sethysatyajit/Form-Builder-Web-App.git
   cd Form-Builder-Web-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Or run in development mode with auto-reload:
   ```bash
   npm run dev
   ```

4. Open in your browser:
   ```
   http://localhost:3000
   ```

## 📖 Usage

- **Create a form**: Use the drag-and-drop builder to add fields.  
- **Save & share**: Save your form and get a shareable link.  
- **Collect responses**: Users can fill the form via the shared link.  
- **View responses**: Use the dashboard to see form submissions and statistics.

---

## 👨‍💻 Author
- **Satyajit Sethy**  
- GitHub: [sethysatyajit](https://github.com/sethysatyajit)
