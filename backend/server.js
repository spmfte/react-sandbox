const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/api/file-system', async (req, res) => {
  try {
    const requestedPath = req.query.path.replace('~', os.homedir());
    const fileSystem = await getDirectoryStructure(requestedPath);
    res.json(fileSystem);
  } catch (error) {
    console.error('Error reading file system:', error);
    res.status(500).json({ error: 'Failed to read file system' });
  }
});

app.get('/api/file-content', async (req, res) => {
  try {
    const filePath = req.query.path.replace('~', os.homedir());
    const content = await fs.readFile(filePath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

async function getDirectoryStructure(dir) {
  const files = await fs.readdir(dir);
  const structure = {};

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      structure[file] = await getDirectoryStructure(fullPath);
    } else {
      structure[file] = 'file';
    }
  }

  return structure;
}

wss.on('connection', (ws) => {
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  shell.on('data', (data) => {
    ws.send(data);
  });

  ws.on('message', (message) => {
    shell.write(message);
  });

  ws.on('close', () => {
    shell.kill();
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});