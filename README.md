# SmarthomeFrontend

The React frontend for the Smarthome project.

## Prerequisites

Make sure you have the following software installed before you begin:

- [Node.js](https://nodejs.org/) (v20.19+, v22.12+, or the latest LTS version)
- npm (included automatically with Node.js)
- [Git](https://git-scm.com/)

Verify your installed versions in the terminal:

```bash
node -v
npm -v
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Smartenvironment5/SmarthomeFrontend
   cd SmarthomeFrontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

## Running the Project

Start the local development server:

```bash
npm run dev
```

Open the URL displayed in your terminal (default: `http://localhost:5173`). Press `Ctrl + C` in the terminal to stop the server.

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with hot-reload |
| `npm run build` | Builds the application for production into the `dist/` folder |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check the code for errors |

## Troubleshooting (Windows)

**PowerShell blocks `npm` (`running scripts is disabled on this system`):**
Run this once in PowerShell to allow local scripts for your user account, then try again:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Error about `Cannot find native binding`:**
Remove `node_modules` and `package-lock.json`, then reinstall dependencies:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
