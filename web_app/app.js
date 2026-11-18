/**
 * OpenSSL & Hybrid Cryptography Suite - Main Application Logic
 * Implements real-world Hybrid Encryption (AES-256-GCM + RSA-2048-OAEP + SHA-256)
 * with 12 distinct, individual steps via the W3C Web Crypto API.
 */

// Application State
const state = {
  keyPair: null,           // RSA { publicKey, privateKey } CryptoKey objects
  publicKeyPem: '',        // Receiver's Public Key PEM
  sharedPublicKeyPem: '',  // Sender's Received Public Key PEM
  selectedFile: null,      // { name, size, type, buffer }
  rawAesKey: null,         // 32-byte ArrayBuffer
  aesKey: null,            // CryptoKey (AES-GCM)
  iv: null,                // 12-byte Uint8Array
  encryptedData: null,     // ArrayBuffer (AES-GCM ciphertext)
  encryptedAesKey: null,   // ArrayBuffer (RSA-OAEP ciphertext)
  originalSha256: '',      // 64 hex chars
  transferPackage: null,   // Serialized JSON transfer object
  recoveredAesKey: null,   // CryptoKey (Recovered AES-GCM)
  decryptedBuffer: null,   // ArrayBuffer
  recomputedSha256: '',    // 64 hex chars
  decryptedBlob: null      // Blob
};

// --- BASE64 & HEX CRYPTOGRAPHIC CONVERSION HELPERS ---
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function spkiToPem(spkiBuffer) {
  const b64 = arrayBufferToBase64(spkiBuffer);
  const lines = b64.match(/.{1,64}/g) || [b64];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

function pemToSpki(pem) {
  const cleanPem = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s+/g, '');
  return base64ToArrayBuffer(cleanPem);
}

// --- NOTIFICATION TOAST ---
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// --- COPY TEXT HELPER ---
function copyText(text, btn) {
  navigator.clipboard.writeText(text);
  const origText = btn.textContent;
  btn.textContent = '✅ Copied to Clipboard!';
  setTimeout(() => {
    btn.textContent = origText;
  }, 2200);
  showToast('Copied command to clipboard!');
}

// --- CARD STATUS CONTROLLER ---
function setCardState(stepNum, statusText, statusClass) {
  const card = document.getElementById(`card-step-${stepNum}`);
  const pill = document.getElementById(`status-step-${stepNum}`);
  if (card && pill) {
    card.classList.remove('active', 'completed');
    if (statusClass === 'active') card.classList.add('active');
    if (statusClass === 'completed') card.classList.add('completed');
    pill.textContent = statusText;
  }
}

// ==========================================
// 12 INDIVIDUAL STEP EXECUTIONS
// ==========================================

// STEP 1: Receiver generates RSA-2048 Key Pair
async function executeStep1() {
  const btn = document.getElementById('btn-step-1');
  btn.disabled = true;
  btn.textContent = '⏳ Generating 2048-bit Key Pair...';
  setCardState(1, 'In Progress', 'active');

  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const spki = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const pem = spkiToPem(spki);

    state.keyPair = keyPair;
    state.publicKeyPem = pem;

    document.getElementById('txt-step1-pubkey').value = pem;
    const privStatus = document.getElementById('step1-privkey-status');
    privStatus.textContent = '✅ RSA-2048 Private Key safely loaded in secure browser memory';
    privStatus.classList.remove('waiting');
    privStatus.classList.add('ready');

    setCardState(1, '✅ Completed', 'completed');
    document.getElementById('btn-step-2').disabled = false;
    setCardState(2, 'Ready to Share', 'active');
    showToast('Step 1 Complete: RSA-2048 Key Pair Generated!');
  } catch (err) {
    console.error('Step 1 Error:', err);
    alert('Step 1 Failed: ' + err.message);
    setCardState(1, 'Error', '');
  } finally {
    btn.disabled = false;
    btn.textContent = '🔑 Step 1: Re-Generate RSA-2048 Key Pair';
  }
}

// STEP 2: Receiver shares Public Key with Sender
function executeStep2() {
  if (!state.publicKeyPem) {
    alert('Please execute Step 1 first to generate the Public Key.');
    return;
  }
  state.sharedPublicKeyPem = state.publicKeyPem;
  document.getElementById('txt-step2-sender-key').value = state.sharedPublicKeyPem;
  
  const status = document.getElementById('step2-status');
  status.textContent = '✅ Public Key securely received and loaded by Sender';
  status.classList.remove('waiting');
  status.classList.add('ready');

  setCardState(2, '✅ Completed', 'completed');
  checkEnableSenderActions();
  showToast('Step 2 Complete: Public Key shared with Sender!');
}

// STEP 3: Sender selects file
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  loadFileObject(file);
}

function loadFileObject(file) {
  const reader = new FileReader();
  reader.onload = () => {
    state.selectedFile = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      buffer: reader.result
    };
    updateStep3FileInfo();
    setCardState(3, '✅ Completed', 'completed');
    checkEnableSenderActions();
    showToast(`Step 3 Complete: Loaded ${file.name}`);
  };
  reader.readAsArrayBuffer(file);
}

async function loadSamplePdf() {
  try {
    const response = await fetch('sample_document.pdf');
    if (!response.ok) throw new Error('Could not fetch sample_document.pdf');
    const buffer = await response.arrayBuffer();
    state.selectedFile = {
      name: 'sample_confidential_document.pdf',
      size: buffer.byteLength,
      type: 'application/pdf',
      buffer: buffer
    };
    updateStep3FileInfo();
    setCardState(3, '✅ Completed', 'completed');
    checkEnableSenderActions();
    showToast('Step 3 Complete: Loaded sample_confidential_document.pdf!');
  } catch (err) {
    console.warn('Fallback generating inline PDF:', err);
    const minimalPdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 18 Tf 100 700 Td (OpenSSL CNS Hybrid Project) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000109 00000 n\n0000000185 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n279\n%%EOF';
    const enc = new TextEncoder();
    const buffer = enc.encode(minimalPdf).buffer;
    state.selectedFile = {
      name: 'sample_document.pdf',
      size: buffer.byteLength,
      type: 'application/pdf',
      buffer: buffer
    };
    updateStep3FileInfo();
    setCardState(3, '✅ Completed', 'completed');
    checkEnableSenderActions();
    showToast('Step 3 Complete: Memory sample document ready!');
  }
}

function updateStep3FileInfo() {
  const badge = document.getElementById('step3-file-info');
  const nameLabel = document.getElementById('step3-filename');
  const sizeLabel = document.getElementById('step3-filesize');
  if (state.selectedFile) {
    badge.classList.remove('hidden');
    nameLabel.textContent = `📄 ${state.selectedFile.name}`;
    sizeLabel.textContent = `${(state.selectedFile.size / 1024).toFixed(2)} KB`;
  }
}

function checkEnableSenderActions() {
  if (state.selectedFile) {
    document.getElementById('btn-step-4').disabled = false;
    document.getElementById('btn-step-7').disabled = false;
    setCardState(4, 'Ready to Generate', 'active');
    setCardState(7, 'Ready to Hash', 'active');
  }
  if (state.rawAesKey && state.selectedFile) {
    document.getElementById('btn-step-5').disabled = false;
    setCardState(5, 'Ready to Encrypt', 'active');
  }
  if (state.rawAesKey && state.sharedPublicKeyPem) {
    document.getElementById('btn-step-6').disabled = false;
    setCardState(6, 'Ready to Encapsulate', 'active');
  }
}

// STEP 4: Application generates random AES-256 Key & IV
async function executeStep4() {
  const btn = document.getElementById('btn-step-4');
  btn.disabled = true;

  try {
    const aesKey = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const rawAesKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    state.aesKey = aesKey;
    state.rawAesKey = rawAesKey;
    state.iv = iv;

    document.getElementById('step4-aes-key-hex').textContent = `${bufToHex(rawAesKey)} (256 bits)`;
    document.getElementById('step4-iv-hex').textContent = `${bufToHex(iv)} (96 bits)`;

    setCardState(4, '✅ Completed', 'completed');
    checkEnableSenderActions();
    showToast('Step 4 Complete: AES-256 Key & IV Generated!');
  } catch (err) {
    console.error('Step 4 Error:', err);
    alert('Step 4 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 5: AES-256-GCM Encrypts the File Payload
async function executeStep5() {
  if (!state.selectedFile || !state.aesKey || !state.iv) {
    alert('Please execute Step 3 and Step 4 first.');
    return;
  }
  const btn = document.getElementById('btn-step-5');
  btn.disabled = true;

  try {
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: state.iv },
      state.aesKey,
      state.selectedFile.buffer
    );
    state.encryptedData = encryptedData;

    document.getElementById('step5-cipher-len').textContent = `${encryptedData.byteLength} bytes (AES-GCM Payload)`;
    document.getElementById('step5-auth-tag').textContent = `128-bit authentication tag appended`;

    setCardState(5, '✅ Completed', 'completed');
    checkEnableStep8();
    showToast('Step 5 Complete: File payload encrypted with AES-256-GCM!');
  } catch (err) {
    console.error('Step 5 Error:', err);
    alert('Step 5 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 6: RSA Encrypts AES Key via Receiver's Public Key
async function executeStep6() {
  if (!state.rawAesKey || !state.sharedPublicKeyPem) {
    alert('Please execute Step 2 and Step 4 first.');
    return;
  }
  const btn = document.getElementById('btn-step-6');
  btn.disabled = true;

  try {
    const spkiBuffer = pemToSpki(state.sharedPublicKeyPem);
    const rsaPubKey = await window.crypto.subtle.importKey(
      'spki',
      spkiBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      rsaPubKey,
      state.rawAesKey
    );
    state.encryptedAesKey = encryptedAesKey;

    document.getElementById('step6-enc-key-len').textContent = `${encryptedAesKey.byteLength} bytes (2048-bit RSA Ciphertext)`;

    setCardState(6, '✅ Completed', 'completed');
    checkEnableStep8();
    showToast('Step 6 Complete: AES Key encapsulated with RSA-OAEP!');
  } catch (err) {
    console.error('Step 6 Error:', err);
    alert('Step 6 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 7: SHA-256 Calculates Original File Digest
async function executeStep7() {
  if (!state.selectedFile) {
    alert('Please select a file in Step 3 first.');
    return;
  }
  const btn = document.getElementById('btn-step-7');
  btn.disabled = true;

  try {
    const originalHashBuffer = await window.crypto.subtle.digest('SHA-256', state.selectedFile.buffer);
    const originalHashHex = bufToHex(originalHashBuffer);
    state.originalSha256 = originalHashHex;

    document.getElementById('step7-sha-hex').textContent = originalHashHex;

    setCardState(7, '✅ Completed', 'completed');
    checkEnableStep8();
    showToast('Step 7 Complete: SHA-256 Digest Calculated!');
  } catch (err) {
    console.error('Step 7 Error:', err);
    alert('Step 7 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

function checkEnableStep8() {
  if (state.encryptedData && state.encryptedAesKey && state.originalSha256) {
    document.getElementById('btn-step-8').disabled = false;
    setCardState(8, 'Ready to Assemble', 'active');
  }
}

// STEP 8: Application Builds Encrypted JSON Transfer Package
function executeStep8() {
  if (!state.encryptedData || !state.encryptedAesKey || !state.originalSha256) {
    alert('Please ensure Steps 5, 6, and 7 are completed.');
    return;
  }

  const transferPackage = {
    protocol: 'HYBRID-AES256GCM-RSA2048-SHA256',
    version: '1.0',
    timestamp: new Date().toISOString(),
    fileName: state.selectedFile.name,
    fileType: state.selectedFile.type,
    fileSize: state.selectedFile.size,
    originalSha256: state.originalSha256,
    iv: arrayBufferToBase64(state.iv),
    encryptedAesKey: arrayBufferToBase64(state.encryptedAesKey),
    encryptedData: arrayBufferToBase64(state.encryptedData)
  };
  state.transferPackage = transferPackage;

  const jsonStr = JSON.stringify(transferPackage, null, 2);
  document.getElementById('txt-step8-json').value = jsonStr;
  document.getElementById('btn-step8-download').disabled = false;
  document.getElementById('btn-step8-transmit').disabled = false;

  setCardState(8, '✅ Completed', 'completed');
  document.getElementById('btn-step-9').disabled = false;
  setCardState(9, 'Ready to Decrypt Key', 'active');
  showToast('Step 8 Complete: .secpack.json Package Built!');
}

function downloadPackageJson() {
  if (!state.transferPackage) return;
  const jsonStr = JSON.stringify(state.transferPackage, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.transferPackage.fileName}.secpack.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Saved package file!');
}

function transmitToReceiver() {
  document.getElementById('card-step-9').scrollIntoView({ behavior: 'smooth' });
  showToast('Package transmitted to Receiver Station (Steps 9-12)!');
}

// STEP 9: Receiver Recovers AES Key via Private Key
async function executeStep9() {
  if (!state.transferPackage || !state.keyPair || !state.keyPair.privateKey) {
    alert('Please ensure Step 1 and Step 8 are executed first.');
    return;
  }
  const btn = document.getElementById('btn-step-9');
  btn.disabled = true;

  try {
    const encAesKeyBuffer = base64ToArrayBuffer(state.transferPackage.encryptedAesKey);
    const recoveredRawKeyBuffer = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      state.keyPair.privateKey,
      encAesKeyBuffer
    );
    const recoveredKeyHex = bufToHex(recoveredRawKeyBuffer);
    const originalKeyHex = bufToHex(state.rawAesKey);

    const recoveredAesKey = await window.crypto.subtle.importKey(
      'raw',
      recoveredRawKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    state.recoveredAesKey = recoveredAesKey;

    document.getElementById('step9-recovered-key-hex').textContent = `${recoveredKeyHex} (256 bits)`;
    const matchStatus = document.getElementById('step9-match-status');
    if (recoveredKeyHex === originalKeyHex) {
      matchStatus.textContent = '✅ Exact Match with Step 4 Key!';
      matchStatus.style.color = '#34d399';
    } else {
      matchStatus.textContent = '❌ Key Mismatch';
      matchStatus.style.color = '#ef4444';
    }

    setCardState(9, '✅ Completed', 'completed');
    document.getElementById('btn-step-10').disabled = false;
    setCardState(10, 'Ready to Decrypt File', 'active');
    showToast('Step 9 Complete: AES Key Recovered via RSA Private Key!');
  } catch (err) {
    console.error('Step 9 Error:', err);
    alert('Step 9 Decryption Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 10: AES-256-GCM Decrypts the File Payload
async function executeStep10() {
  if (!state.recoveredAesKey || !state.transferPackage) {
    alert('Please execute Step 9 first.');
    return;
  }
  const btn = document.getElementById('btn-step-10');
  btn.disabled = true;

  try {
    const ivBuffer = base64ToArrayBuffer(state.transferPackage.iv);
    const encDataBuffer = base64ToArrayBuffer(state.transferPackage.encryptedData);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      state.recoveredAesKey,
      encDataBuffer
    );
    state.decryptedBuffer = decryptedBuffer;

    document.getElementById('step10-decrypted-size').textContent = `${decryptedBuffer.byteLength} bytes recovered`;
    const tagStatus = document.getElementById('step10-aead-status');
    tagStatus.textContent = '✅ Verified Authentic (Tag Match)';
    tagStatus.style.color = '#34d399';

    setCardState(10, '✅ Completed', 'completed');
    document.getElementById('btn-step-11').disabled = false;
    setCardState(11, 'Ready to Verify Hash', 'active');
    showToast('Step 10 Complete: Payload decrypted with AES-256-GCM!');
  } catch (err) {
    console.error('Step 10 Error:', err);
    alert('Step 10 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 11: SHA-256 Verifies Decrypted File Integrity
async function executeStep11() {
  if (!state.decryptedBuffer || !state.transferPackage) {
    alert('Please execute Step 10 first.');
    return;
  }
  const btn = document.getElementById('btn-step-11');
  btn.disabled = true;

  try {
    const computedHashBuffer = await window.crypto.subtle.digest('SHA-256', state.decryptedBuffer);
    const computedHashHex = bufToHex(computedHashBuffer);
    state.recomputedSha256 = computedHashHex;

    document.getElementById('step11-orig-sha').textContent = state.transferPackage.originalSha256;
    document.getElementById('step11-recomputed-sha').textContent = computedHashHex;

    const banner = document.getElementById('step11-match-banner');
    if (computedHashHex.toLowerCase() === state.transferPackage.originalSha256.toLowerCase()) {
      banner.classList.remove('hidden');
      setCardState(11, '✅ Verified Match', 'completed');
      prepareStep12Download();
      showToast('Step 11 Complete: SHA-256 100% Integrity Match!');
    } else {
      alert('Integrity Mismatch! Hash does not match.');
      setCardState(11, '❌ Integrity Failed', '');
    }
  } catch (err) {
    console.error('Step 11 Error:', err);
    alert('Step 11 Failed: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// STEP 12: Receiver Previews & Downloads Original Verified PDF
function prepareStep12Download() {
  const blob = new Blob([state.decryptedBuffer], { type: state.transferPackage.fileType });
  state.decryptedBlob = blob;
  const url = URL.createObjectURL(blob);

  const downloadBtn = document.getElementById('btn-step-12-download');
  downloadBtn.href = url;
  downloadBtn.download = state.transferPackage.fileName;
  downloadBtn.removeAttribute('disabled');
  document.getElementById('step12-filename-lbl').textContent = state.transferPackage.fileName;
  document.getElementById('step12-success-note').classList.remove('hidden');

  setCardState(12, '✅ File Ready', 'completed');
}

// ==========================================
// AUTOMATED RUNNER & RESET
// ==========================================
async function runAll12StepsAutomatically() {
  const masterBtn = document.getElementById('btn-run-all-12-steps');
  masterBtn.disabled = true;
  masterBtn.textContent = '⏳ Executing 12 Steps...';

  try {
    // 1
    await executeStep1();
    await new Promise(r => setTimeout(r, 400));

    // 2
    executeStep2();
    await new Promise(r => setTimeout(r, 300));

    // 3
    if (!state.selectedFile) {
      await loadSamplePdf();
      await new Promise(r => setTimeout(r, 300));
    }

    // 4
    await executeStep4();
    await new Promise(r => setTimeout(r, 400));

    // 5
    await executeStep5();
    await new Promise(r => setTimeout(r, 400));

    // 6
    await executeStep6();
    await new Promise(r => setTimeout(r, 400));

    // 7
    await executeStep7();
    await new Promise(r => setTimeout(r, 400));

    // 8
    executeStep8();
    await new Promise(r => setTimeout(r, 400));

    // 9
    await executeStep9();
    await new Promise(r => setTimeout(r, 400));

    // 10
    await executeStep10();
    await new Promise(r => setTimeout(r, 400));

    // 11
    await executeStep11();
    await new Promise(r => setTimeout(r, 400));

    // 12
    document.getElementById('card-step-12').scrollIntoView({ behavior: 'smooth' });
    showToast('🎉 All 12 Steps Completed Successfully!');
  } catch (err) {
    console.error('Automated run error:', err);
    alert('Automated run halted: ' + err.message);
  } finally {
    masterBtn.disabled = false;
    masterBtn.textContent = '⚡ Run All 12 Steps Automatically';
  }
}

function resetWorkflow() {
  location.reload();
}

// ==========================================
// NAVIGATION & TABS
// ==========================================
function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  const expBtns = document.querySelectorAll('.exp-tab-btn');
  expBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      expBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.exp-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetExp = document.getElementById(btn.dataset.exp);
      if (targetExp) targetExp.classList.add('active');
    });
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  setupNavigation();

  // Top Action Bar
  document.getElementById('btn-run-all-12-steps').addEventListener('click', runAll12StepsAutomatically);
  document.getElementById('btn-reset-workflow').addEventListener('click', resetWorkflow);

  // Individual Step Buttons
  document.getElementById('btn-step-1').addEventListener('click', executeStep1);
  document.getElementById('btn-step-2').addEventListener('click', executeStep2);
  document.getElementById('ind-file-input').addEventListener('change', handleFileSelect);
  document.getElementById('btn-step-3-sample').addEventListener('click', loadSamplePdf);
  document.getElementById('btn-step-4').addEventListener('click', executeStep4);
  document.getElementById('btn-step-5').addEventListener('click', executeStep5);
  document.getElementById('btn-step-6').addEventListener('click', executeStep6);
  document.getElementById('btn-step-7').addEventListener('click', executeStep7);
  document.getElementById('btn-step-8').addEventListener('click', executeStep8);
  document.getElementById('btn-step8-download').addEventListener('click', downloadPackageJson);
  document.getElementById('btn-step8-transmit').addEventListener('click', transmitToReceiver);
  document.getElementById('btn-step-9').addEventListener('click', executeStep9);
  document.getElementById('btn-step-10').addEventListener('click', executeStep10);
  document.getElementById('btn-step-11').addEventListener('click', executeStep11);
});

// ==========================================
// INTERACTIVE OPENSSL EXPERIMENTS SIMULATOR
// ==========================================

const simLimits = {
  aes: 7,
  rsa: 7,
  sha: 6
};

function highlightInternalStep(algo, stepNum) {
  const maxSteps = simLimits[algo] || 6;
  if (stepNum < 1 || stepNum > maxSteps) return;

  // Highlight pipeline node
  for (let i = 1; i <= maxSteps; i++) {
    const node = document.getElementById(`pnode-${algo}-${i}`);
    if (node) {
      if (i === stepNum) node.classList.add('active');
      else node.classList.remove('active');
    }
    const item = document.getElementById(`istep-${algo}-${i}`);
    if (item) {
      if (i === stepNum) item.classList.add('active');
      else item.classList.remove('active');
    }
  }

  const statusLabel = document.getElementById(`sim-status-${algo}`);
  if (statusLabel) {
    statusLabel.textContent = `Inspecting Step ${stepNum} of ${maxSteps}`;
  }

  const activeItem = document.getElementById(`istep-${algo}-${stepNum}`);
  if (activeItem) {
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function playInternalSim(algo) {
  const maxSteps = simLimits[algo] || 6;
  const statusLabel = document.getElementById(`sim-status-${algo}`);

  for (let s = 1; s <= maxSteps; s++) {
    highlightInternalStep(algo, s);
    if (statusLabel) statusLabel.textContent = `▶ Simulating Step ${s} of ${maxSteps}...`;
    await new Promise(r => setTimeout(r, 700));
  }

  if (statusLabel) {
    statusLabel.textContent = `✅ Internal simulation finished (${maxSteps} steps completed).`;
  }
  showToast(`Simulated all internal steps for ${algo.toUpperCase()}!`);
}

function resetInternalSim(algo) {
  highlightInternalStep(algo, 1);
  const statusLabel = document.getElementById(`sim-status-${algo}`);
  if (statusLabel) statusLabel.textContent = 'Reset to Step 1. Click any step to inspect.';
}

// Live SHA-256 Interactive Calculator
async function updateLiveSha() {
  const inputEl = document.getElementById('live-sha-input');
  const outputEl = document.getElementById('live-sha-output');
  if (!inputEl || !outputEl) return;

  const text = inputEl.value;
  const enc = new TextEncoder();
  const buffer = enc.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  outputEl.textContent = bufToHex(hashBuffer);
}

// Live Avalanche Effect Demonstration
async function testLiveAvalanche() {
  const inputEl = document.getElementById('live-sha-input');
  if (!inputEl) return;

  const currentVal = inputEl.value;
  if (currentVal.endsWith('!')) {
    inputEl.value = currentVal.slice(0, -1);
  } else {
    inputEl.value = currentVal + '!';
  }
  await updateLiveSha();
  showToast('Toggled 1 character! Notice the entire SHA-256 digest flipped (Avalanche Effect).');
}

// Attach Live Hasher Listeners
window.addEventListener('DOMContentLoaded', () => {
  const liveShaInput = document.getElementById('live-sha-input');
  if (liveShaInput) {
    liveShaInput.addEventListener('input', updateLiveSha);
    updateLiveSha();
  }
});
