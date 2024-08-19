# React Sandbox with WebSocket-Enabled Terminal

![React Sandbox](https://github.com/user-attachments/assets/c310dc38-f11e-4576-8d7a-1aef210e82f9)

This project is a React-based sandbox environment featuring a live code editor, a WebSocket-enabled terminal, and a real-time output viewer. It’s designed for interactive coding experiments with live preview capabilities, all within a single-page application.

## 🚀 Features

- **Interactive Code Editor**: Write and execute code in a live environment.
- **WebSocket-Enabled Terminal**: Real-time terminal session powered by `xterm.js` and WebSocket.
- **Live Preview**: See output changes instantly as you modify the code.
- **Error Display**: Real-time error feedback for a seamless development experience.

## 🧩 Components

### `CodeEditor.js`
- Implements Monaco Editor for a powerful code editing experience.
- Supports syntax highlighting and auto-completion.

### `Terminal.js`
- Integrates `xterm.js` for terminal emulation.
- Uses WebSocket to connect the terminal to a backend shell.
- Resizes dynamically based on the window dimensions.

### `ErrorDisplay.js`
- Displays error messages in a clear and concise manner.
- Highlights errors in a distinct red color for easy identification.

### `ReactSandbox.js`
- The main layout component that organizes the code editor and output view.
- Uses custom hooks for managing code execution and error handling.

## 🛠️ Backend

- **Express Server**: Serves the React app and provides APIs for file system access.
- **WebSocket Server**: Handles real-time communication between the frontend terminal and a bash shell.
- **Node-PTY**: Powers the terminal sessions, allowing for shell interactions.

## 📦 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/spmfte/react-sandbox.git
    cd react-sandbox
    ```

2. Install the dependencies for both frontend and backend:
    ```bash
    npm install
    cd client
    npm install
    ```

3. Start the development server:
    ```bash
    cd ..
    npm run dev
    ```

4. Navigate to `http://localhost:3000` to view the app.

## 📝 License

This project is licensed under the MIT License.
