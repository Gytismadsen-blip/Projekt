/* ---------------- ENCRYPTED BACKUP / RESTORE ---------------- */
const BACKUP_KEYS = [CASES_KEY, ACTIVE_CASE_KEY, 'regnemaskine_favs', LANG_KEY, 'regnemaskine_theme', 'regnemaskine_cat'];

async function deriveAesKey(passphrase, saltBytes) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufToB64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
function b64ToBuf(b64) { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)); }

async function exportBackup() {
  if (!window.crypto?.subtle) { alert('Din browser understøtter ikke kryptering (Web Crypto API mangler).'); return; }
  const passphrase = prompt('Vælg en adgangskode til din krypterede backup (husk den — den kan ikke gendannes uden):');
  if (!passphrase) return;

  const payload = {};
  BACKUP_KEYS.forEach(key => { const v = localStorage.getItem(key); if (v !== null) payload[key] = v; });

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(payload)));

  const file = {
    app: 'LogistikCalc — Logistik & Økonomi',
    version: 1,
    encrypted: true,
    algorithm: 'AES-GCM-256 / PBKDF2-SHA256',
    salt: bufToB64(salt),
    iv: bufToB64(iv),
    data: bufToB64(ciphertext)
  };

  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `regnemaskine-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function importBackupFile(file) {
  if (!window.crypto?.subtle) { alert('Din browser understøtter ikke kryptering (Web Crypto API mangler).'); return; }
  const text = await file.text();
  let envelope;
  try { envelope = JSON.parse(text); } catch (e) { alert('Filen kunne ikke læses — er det en gyldig backup-fil?'); return; }
  if (!envelope.encrypted || !envelope.salt || !envelope.iv || !envelope.data) { alert('Dette ligner ikke en gyldig LogistikCalc-backup.'); return; }

  const passphrase = prompt('Indtast adgangskoden til denne backup-fil:');
  if (!passphrase) return;

  try {
    const key = await deriveAesKey(passphrase, b64ToBuf(envelope.salt));
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBuf(envelope.iv) }, key, b64ToBuf(envelope.data));
    const payload = JSON.parse(new TextDecoder().decode(plainBuf));

    if (!confirm('Import vil overskrive dine nuværende cases og indstillinger på denne computer. Fortsæt?')) return;

    Object.entries(payload).forEach(([key, value]) => localStorage.setItem(key, value));
    alert('Backup importeret! Siden genindlæses nu.');
    location.reload();
  } catch (e) {
    alert('Kunne ikke dekryptere filen — forkert adgangskode, eller filen er beskadiget.');
  }
}

function initBackup() {
  document.getElementById('backup-export-btn').addEventListener('click', exportBackup);
  document.getElementById('backup-import-btn').addEventListener('click', () => document.getElementById('backup-file-input').click());
  document.getElementById('backup-file-input').addEventListener('change', (e) => {
    if (e.target.files[0]) importBackupFile(e.target.files[0]);
    e.target.value = '';
  });
}

