# 🎨 Paper2Code Frontend

Beautiful, real-time interfaces for Paper2Code - Available in **Streamlit** and **React**!

---

## 🌟 Features

Both frontends include:

✨ **Beautiful, Modern Design**
- Gradient backgrounds and glass-morphism effects
- Smooth animations and transitions
- Responsive layout
- Dark theme optimized for developers

⚡ **Real-Time Processing**
- Live progress updates
- Step-by-step processing visualization
- Instant feedback

💻 **Complete Functionality**
- PDF upload with drag & drop
- Configuration options (framework, logging, checkpointing)
- Code preview with syntax highlighting
- Download generated files
- Processing statistics dashboard

---

## 📱 Screenshots

### Streamlit App
![Streamlit App](https://via.placeholder.com/800x450/0f172a/6366f1?text=Paper2Code+Streamlit)

**Features:**
- Multi-tab interface
- Real-time progress indicators
- Interactive metrics
- Code preview
- Download buttons

### React App
![React App](https://via.placeholder.com/800x450/0f172a/ec4899?text=Paper2Code+React)

**Features:**
- Modern gradient design
- Glass-morphism effects
- Smooth animations
- Responsive grid layout
- Beautiful typography

---

## 🚀 Quick Start

### Option 1: Streamlit (Easiest)

```bash
cd streamlit_app

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py
```

Open browser at `http://localhost:8501`

### Option 2: React (Most Beautiful)

```bash
cd react_app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser at `http://localhost:5173`

---

## 📂 Project Structure

```
paper2code_frontend/
├── streamlit_app/
│   ├── app.py                 # Main Streamlit application
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Streamlit-specific docs
│
└── react_app/
    ├── Paper2CodeApp.jsx     # Main React component
    ├── package.json          # Node dependencies
    ├── tailwind.config.js    # Tailwind configuration
    └── README.md             # React-specific docs
```

---

## 🎨 Design System

### Color Palette

```css
Primary:    #6366f1 (Indigo)
Secondary:  #8b5cf6 (Purple)
Accent:     #ec4899 (Pink)
Success:    #10b981 (Green)
Background: #0f172a (Slate)
```

### Typography

- **Display Font**: Space Grotesk (modern, geometric)
- **Code Font**: JetBrains Mono (readable monospace)

### Key Features

- **Glass-morphism**: Translucent cards with blur effects
- **Gradients**: Smooth color transitions
- **Animations**: Fade-ins, slide-ups, pulses
- **Responsive**: Mobile-friendly layouts

---

## 🔧 Streamlit App Details

### Features

1. **Multi-Tab Interface**
   - Upload Paper
   - Dashboard (statistics)
   - About

2. **Real-Time Processing**
   - Progress bar
   - Step-by-step updates
   - Live status messages

3. **Configuration Panel**
   - Framework selection (PyTorch/TensorFlow)
   - Feature toggles (logging, checkpointing)
   - Dataset path input

4. **Results Display**
   - Extracted metrics (architecture, lr, batch size)
   - Code preview with syntax highlighting
   - Download buttons (train.py, metadata.json, ZIP)

### Customization

```python
# app.py

# Change color scheme
st.markdown("""
<style>
    :root {
        --primary-color: #your-color;
    }
</style>
""", unsafe_allow_html=True)

# Add new tabs
tab1, tab2, tab3, tab4 = st.tabs(["Upload", "Dashboard", "About", "Your Tab"])

# Modify configuration
config = {
    'framework': st.selectbox("Framework", ["PyTorch", "TensorFlow", "JAX"]),
    # Add more options
}
```

### Running with Backend

To connect to actual Paper2Code backend:

```python
# Uncomment in app.py
from paper2code.pipeline import Paper2CodePipeline

pipeline = Paper2CodePipeline()
result = pipeline.process_paper(uploaded_file)
```

---

## ⚛️ React App Details

### Tech Stack

- **React 18**: Latest features
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool

### Components

```jsx
// Main component structure
Paper2CodeApp
├── Header (logo, navigation)
├── Hero (title, stats)
├── Upload Section (file input, config)
├── Processing Pipeline (live updates)
├── Results (code preview, downloads)
└── Footer
```

### Customization

```jsx
// Paper2CodeApp.jsx

// Change colors
const theme = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899'
};

// Add new sections
<div className="grid grid-cols-3 gap-8">
  <YourCustomSection />
</div>

// Modify animations
<div className="animate-slide-up delay-200">
  {/* Your content */}
</div>
```

### API Integration

```jsx
// Add API endpoint
const processFile = async () => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/process', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  setResult(result);
};
```

---

## 🎯 Deployment

### Deploy Streamlit

**Streamlit Cloud** (Recommended):
1. Push code to GitHub
2. Visit [streamlit.io/cloud](https://streamlit.io/cloud)
3. Connect repository
4. Deploy!

**Heroku**:
```bash
# Create Procfile
echo "web: streamlit run app.py --server.port=$PORT" > Procfile

# Deploy
heroku create
git push heroku main
```

### Deploy React

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**GitHub Pages**:
```bash
npm run build
# Copy dist/ to gh-pages branch
```

---

## 💡 Features Comparison

| Feature | Streamlit | React |
|---------|-----------|-------|
| Setup Time | ⚡ 5 minutes | ⏱️ 15 minutes |
| Design Quality | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Customization | Medium | High |
| Performance | Good | Excellent |
| Mobile Support | Good | Excellent |
| Learning Curve | Easy | Medium |
| Best For | Prototypes, demos | Production apps |

---

## 🎨 Customization Guide

### Change Theme

**Streamlit:**
```python
# .streamlit/config.toml
[theme]
primaryColor = "#6366f1"
backgroundColor = "#0f172a"
secondaryBackgroundColor = "#1e293b"
textColor = "#f1f5f9"
```

**React:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6'
      }
    }
  }
}
```

### Add New Features

**Streamlit:**
```python
# Add to tab
with st.tabs(["Upload", "New Feature"])[1]:
    st.markdown("### New Feature")
    # Your code here
```

**React:**
```jsx
// Add to layout
<div className="glass-card p-6">
  <h3>New Feature</h3>
  {/* Your JSX here */}
</div>
```

---

## 📊 Performance Tips

### Streamlit

1. **Cache Functions**
```python
@st.cache_data
def expensive_computation(data):
    return result
```

2. **Lazy Loading**
```python
if st.button("Load Data"):
    data = load_large_dataset()
```

### React

1. **Memoization**
```jsx
const MemoizedComponent = React.memo(ExpensiveComponent);
```

2. **Code Splitting**
```jsx
const LazyComponent = React.lazy(() => import('./Component'));
```

---

## 🐛 Troubleshooting

### Streamlit Issues

**Port already in use:**
```bash
streamlit run app.py --server.port 8502
```

**Slow performance:**
- Use `@st.cache_data` decorator
- Reduce file size
- Optimize images

### React Issues

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styling not working:**
```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

---

## 🎓 Learn More

### Streamlit Resources
- [Streamlit Documentation](https://docs.streamlit.io)
- [Streamlit Gallery](https://streamlit.io/gallery)
- [Streamlit Community](https://discuss.streamlit.io)

### React Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

## 🤝 Contributing

Want to improve the frontend?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Ideas for contribution:**
- Add dark/light mode toggle
- Implement file history
- Add batch processing UI
- Create mobile app version
- Add more visualizations

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **Design Inspiration**: Vercel, Linear, Stripe
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, JetBrains Mono)
- **Framework**: Streamlit, React, Tailwind CSS

---

## 📧 Support

Need help? 

- 📫 Email: support@paper2code.com
- 💬 Discord: [Join our server](https://discord.gg/paper2code)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/paper2code/issues)

---

**Made with ❤️ by the Paper2Code Team**

Choose the frontend that fits your needs:
- **Streamlit**: Fast prototyping, easy deployment
- **React**: Production-ready, highly customizable

Both are beautiful, functional, and ready to use! 🚀
