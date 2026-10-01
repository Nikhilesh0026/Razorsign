const path = require('path');
const fs = require('fs');

exports.roles = ['admin', 'normal', 'branch'];

exports.authFile = (role) => path.join(__dirname, '..', '.auth', `${role}.json`);
exports.sessionFile = (role) => path.join(__dirname, '..', '.auth', `${role}.session.json`);

// Put the saved sessionStorage back before any page script runs
exports.restoreSession = async (context, role) => {
  const data = fs.readFileSync(exports.sessionFile(role), 'utf-8');
  await context.addInitScript((saved) => {
    for (const [key, value] of Object.entries(JSON.parse(saved))) {
      window.sessionStorage.setItem(key, value);
    }
  }, data);
};