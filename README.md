# Responsive Chat UI Assignment

This project is a **responsive, theme-toggleable chat application UI**, designed with a focus on **clean layout, accessibility, and user experience**. It supports both light and dark modes and is mobile-friendly, with an intuitive layout for desktop and smaller screen devices.

## 💡 Features

- **Responsive Layout**: Fully optimized for both desktop and mobile viewports.
- **Dark Mode Support**: Seamless theme switching with clearly defined CSS variables.
- **Contacts Sidebar**:
  - Avatar support with dynamic background colors.
  - Online status indicators.
  - Active contact highlighting.
- **Chat Panel**:
  - Sent and received message bubbles with timestamps.
  - Scrollable chat history.
  - Typing indicator support.
- **Fixed Navbar & Footer**:
  - Minimal top navbar with dark mode toggle and user avatar.
  - Optional footer area for status or version info.
- **Floating Action Button (FAB)**: For toggling contacts on mobile view.

## 🖼️ UI Components

- `Navbar`: Fixed header with logo and dark mode toggle.
- `Contacts Panel`: Sidebar listing recent conversations and online indicators.
- `Chat Panel`: Area to display active chat with messages and input.
- `Message Input Area`: Scrollable textarea and send button with smooth interaction.
- `Dark Mode`: All colors defined using `:root` and `.dark-mode` variables.

## 🛠️ Technologies Used

- HTML5
- CSS3 (Responsive design + CSS Variables)
- Google Fonts (`Roboto`)
- No external libraries or frameworks used

## 📁 Project Structure

├── index.html
├── styles/
│ └── main.css
└── assets/
└── icons, avatars, etc.

## 🔧 How to Use

1. Clone the repository or download the files.
2. Open `index.html` in your browser.
3. Use the **Dark Mode Toggle** on the navbar to switch themes.
4. On mobile, tap the **Floating Action Button** to toggle the contacts panel.

## 🎨 Customization Tips

- Change the theme colors in the `:root` and `.dark-mode` selectors.
- Add more avatar initials and background mappings as needed.
- Customize message bubbles and animation under `.message-bubble`.

## 📱 Mobile Support

- Uses media queries (`max-width: 768px`) for adaptive layout.
- Mobile contacts panel is hidden by default and accessible via FAB.
- Chat panel expands to full width on smaller screens.

## ✅ Future Enhancements

- Add JavaScript for live messaging, typing animation, and backend integration.
- Improve accessibility with ARIA labels and keyboard support.
- Integrate a framework like React or Vue for state management.

---

> Created as part of a front-end assignment focused on responsive and theme-based UI development.
