# OpenSSL Cryptography & Network Security (CNS) Project

A complete, practical implementation of core cryptographic protocols and network security mechanisms using **OpenSSL 3.x** and modern **Web Crypto API**.

---

## 📁 Repository Structure

```
crypt/
│
├── 01_AES_Encryption/             # Experiment 1: AES-256-CBC Symmetric Encryption
│   ├── message.txt                # Plaintext message
│   ├── run_demo.bat               # Interactive step-by-step presentation script
│   ├── run_demo_automated.bat     # Fast automated demonstration script
│   ├── run_demo.ps1               # PowerShell version
│   ├── openssl.cmd                # Local OpenSSL wrapper
│   └── README.md                  # Experiment documentation & viva guide
│
├── 02_RSA_Cryptography/           # Experiment 2: RSA-2048 Asymmetric Cryptography
│   ├── message.txt                # Plaintext message
│   ├── run_demo.bat               # Interactive keygen, encrypt, decrypt script
│   ├── run_demo_automated.bat     # Fast automated demonstration script
│   ├── run_demo.ps1               # PowerShell version
│   ├── openssl.cmd                # Local OpenSSL wrapper
│   └── README.md                  # Experiment documentation & viva guide
│
├── 03_SHA256_Hashing/             # Experiment 3: SHA-256 Hashing & Avalanche Effect
│   ├── original.txt               # Plaintext file
│   ├── run_demo.bat               # Interactive hashing & tampering demonstration
│   ├── run_demo_automated.bat     # Fast automated demonstration script
│   ├── run_demo.ps1               # PowerShell version
│   ├── openssl.cmd                # Local OpenSSL wrapper
│   └── README.md                  # Experiment documentation & viva guide
│
├── 04_TLS_Secure_Communication/   # Experiment 4: TLS 1.3 Server & Client
│   ├── generate_certs.bat         # Generates self-signed X.509 certificate & key
│   ├── start_server.bat           # Starts OpenSSL TLS server on port 4433
│   ├── run_client.bat             # Connects OpenSSL TLS client to localhost:4433
│   ├── openssl.cmd                # Local OpenSSL wrapper
│   └── README.md                  # Experiment documentation & handshake analysis
│
├── web_app/                       # Section 6: Real-World Secure File Transfer App
│   ├── index.html                 # Interactive UI (Hybrid Encryption + CLI explorer)
│   ├── style.css                  # Modern cyber-security dark theme styling
│   ├── app.js                     # Web Crypto API implementation (AES-GCM + RSA-OAEP + SHA-256)
│   └── sample_document.pdf        # Test sample confidential PDF
│
├── RUN_ALL_EXPERIMENTS.bat        # One-click master batch runner for Experiments 1, 2, and 3
├── START_WEB_APP.bat              # Launches the Hybrid Encryption Web App in your browser
├── PRESENTATION_GUIDE.md          # Complete spoken presentation script & viva answers
├── openssl.cmd                    # Root OpenSSL CLI launcher
└── README.md                      # Project overview
```

---

## 🚀 Quick Start Guide

### 1. Launch the Real-World Hybrid Encryption Web App
Double-click `START_WEB_APP.bat` or open `web_app/index.html` in your browser.
- **Station A (Receiver)**: Click `Generate RSA-2048 Key Pair`, then `Auto-Share with Sender Station`.
- **Station B (Sender)**: Click `Load Sample PDF Document`, then `Encrypt File & Build Secure Package`.
- **Station C (Receiver)**: Click `Transmit Package to Receiver`, then `Decrypt & Verify File`.
- Notice the **100% SHA-256 integrity match** and download the recovered PDF!

### 2. Run All OpenSSL Experiments with One Click
Double-click `RUN_ALL_EXPERIMENTS.bat`.
It automatically verifies:
1. `AES-256-CBC` encryption and bit-for-bit decryption (`FC: no differences encountered`).
2. `RSA-2048` key generation, public key encryption, and private key decryption (`FC: no differences encountered`).
3. `SHA-256` hashing and the **Avalanche Effect** when tampering is introduced.

### 3. Run the TLS 1.3 Client-Server Demo
1. Open `04_TLS_Secure_Communication/start_server.bat`. The server starts listening on port 4433.
2. In a second window, open `04_TLS_Secure_Communication/run_client.bat`.
3. Type:
   ```http
   GET / HTTP/1.0
   ```
   and press **Enter twice**.
4. Observe the negotiated **TLS 1.3**, **AES-256-GCM**, and the **HTTP 200 OK** response.

---

## 📊 Summary of Experiments

| # | Experiment | Algorithm | Key Size / Output | Core Purpose |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Symmetric Encryption | AES-256-CBC | 256 bits | Confidentiality using a single shared secret. |
| **2** | Asymmetric Encryption | RSA-2048 OAEP | 2048 bits | Secure key exchange without a pre-shared secret. |
| **3** | Cryptographic Hashing | SHA-256 | 256 bits | Integrity verification and Avalanche Effect detection. |
| **4** | Secure Network Channel | TLS 1.3 | AES-256-GCM | Encrypted, authenticated client-server communication. |
| **5** | Real-World Application | Hybrid Encryption | AES-256 + RSA + SHA | Practical, scalable secure file transfer. |
