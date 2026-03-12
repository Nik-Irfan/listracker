# Minimal Todo App

A beautifully designed, iOS-inspired todo application with glassmorphism effects and smooth interactions.

![Todo App Preview](https://img.shields.io/badge/Design-iOS%20Style-007AFF?style=flat-square)
![Technologies](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-FF6B6B?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-4CAF50?style=flat-square)

## ✨ Features

### 🎨 **iOS Design Language**
- **Glassmorphism UI**: Frosted glass effects with backdrop blur
- **Pill-Shaped Elements**: Modern rounded buttons and inputs
- **Gradient Accents**: Beautiful color gradients throughout
- **White Background**: Clean, minimalist aesthetic
- **Smooth Animations**: Subtle transitions and hover effects

### 📱 **User Experience**
- **Click to Complete**: Tap anywhere on todo to mark done
- **Drag & Drop**: Hold and drag to reorder todos
- **Smart Interactions**: Intuitive click vs drag detection
- **Category System**: Organize todos with colored categories
- **Filtering Options**: Filter by status and category

### 🎯 **Core Functionality**
- **Todo Management**: Add, complete, and delete todos
- **Category Creation**: Custom categories with colors
- **Data Persistence**: Local storage for saving todos
- **Test Data Generator**: Sample data for testing
- **Export/Import**: Backup and restore functionality
- **Theme System**: Multiple color themes (Blue, Green, Orange, Pink, Dark)

## 🚀 Quick Start

### Prerequisites
- Modern web browser with ES6 support
- No build tools required - just open the HTML file!

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/minimal-todo.git
   cd minimal-todo
   ```

2. **Open the application**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   double-click index.html
   ```

3. **Start using!** No additional setup needed.

## 🎮 How to Use

### Adding Todos
1. Type your todo in the input field
2. Select a category (optional)
3. Press Enter or click the + button

### Managing Todos
- **Complete**: Click anywhere on the todo item
- **Delete**: Click the delete button on the right
- **Reorder**: Hold and drag to new position

### Categories
1. **Create**: Settings → Add Category
2. **Organize**: Assign categories when creating todos
3. **Filter**: Use category dropdown to filter todos

### Settings
- **Themes**: Choose from 5 color themes
- **Data Management**: Export, import, or clear data
- **Test Data**: Generate sample todos for testing

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with glassmorphism effects
- **Vanilla JavaScript**: No frameworks, pure ES6+

### Key Features
- **LocalStorage**: Persistent data storage
- **Drag & Drop API**: Native HTML5 drag functionality
- **CSS Transitions**: Smooth animations and effects
- **Responsive Design**: Works on all screen sizes

## 📁 Project Structure

```
minimal-todo/
├── index.html          # Main application HTML
├── styles.css          # Complete styling with glassmorphism
├── script.js           # All JavaScript functionality
├── settings-styles.css # Settings page specific styles
└── README.md           # This file
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#007AFF` (iOS system blue)
- **Success Green**: `#34C759`
- **Danger Red**: `#FF3B30`
- **Warning Orange**: `#FF9500`
- **Text Primary**: `#1d1d1f`
- **Text Secondary**: `#8e8e93`

### Typography
- **Font**: Inter, Apple System, Segoe UI
- **Weights**: 300, 400, 500, 600, 700
- **iOS Native**: System font stack for authenticity

### Effects
- **Glassmorphism**: `backdrop-filter: blur(20px)`
- **Shadows**: Multi-layered for depth
- **Transitions**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

## 🔧 Customization

### Adding New Themes
```css
[data-theme="new-theme"] {
    --primary-color: #your-color;
    --primary-hover: #your-hover-color;
}
```

### Modifying Animations
```css
:root {
    --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --blur: 20px;
}
```

## 🌟 Key Features Explained

### Smart Click Detection
The app intelligently distinguishes between:
- **Quick Click** (<200ms): Toggle completion
- **Hold & Drag** (>200ms): Start reordering
- **No Conflicts**: Clean separation of interactions

### Glassmorphism Effects
- **Backdrop Blur**: Creates frosted glass appearance
- **Transparency**: Subtle opacity for depth
- **Border Highlights**: Glass-like borders and shadows

### Data Persistence
- **LocalStorage**: Automatic saving
- **JSON Format**: Human-readable data structure
- **Export/Import**: Backup functionality

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines
- **No Frameworks**: Keep it vanilla JS
- **iOS Design**: Follow Apple's design language
- **Performance**: Optimize for smooth interactions
- **Accessibility**: Maintain semantic HTML

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apple Design**: Inspired by iOS design language
- **Glassmorphism**: Modern UI design trend
- **Vanilla JS**: Proving no frameworks needed
- **Community**: Open source contributors

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **Portfolio**: [yourwebsite.com](https://yourwebsite.com)

---

<div align="center">
  <p>Made with ❤️ using HTML, CSS & JavaScript</p>
  <p>⭐ Star this repository if you like it!</p>
</div>
