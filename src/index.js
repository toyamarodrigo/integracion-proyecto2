// app -> la aplicacion
// BrowserWindoe -> creacion de ventanas
// Menu -> navegacion
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Alcance global
let mainWindow;

app.on('ready', () => {
  // Carga de ventana
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Tipo de archivo que se va a cargar
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'views/index.html'),
      protocol: 'file',
      slashes: true,
    })
  );
  // Menu personalizado
  const mainMenu = Menu.buildFromTemplate(templateMenu);

  // Seteo del menu personalizado
  Menu.setApplicationMenu(mainMenu);

  // Cerrar la ventana principal cierra todo
  mainWindow.on('closed', () => {
    app.quit();
  });
});

// Template del menu de navegacion
const templateMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Product',
        accelerator: 'Ctrl+N',
        click() {
          createNewProductWindow();
        },
      },
      {
        label: 'Remove All Products',
        click() {
          mainWindow.webContents.send('product:remove-all');
        },
      },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];

// Recarga de ventana + devtools
if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}
