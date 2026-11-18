# Experiment 4: TLS 1.3 Secure Communication

## 1. Concept Overview
- **TLS (Transport Layer Security)**: The industry-standard cryptographic protocol that secures communication across computer networks (most prominently powering HTTPS).
- **Core Security Pillars**:
  1. **Confidentiality**: Encrypts transmitted data using authenticated symmetric ciphers (e.g. AES-256-GCM).
  2. **Integrity**: Employs AEAD (Authenticated Encryption with Associated Data) to detect tampering, replay, or truncation.
  3. **Authentication**: Uses X.509 digital certificates and asymmetric cryptography (RSA / ECDSA) to authenticate the server identity to the client.

---

## 2. Steps to Demonstrate in Presentation

### Step A: Generate Certificate & Private Key
Run in CMD:
```cmd
openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -noenc -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

### Step B: Inspect the Certificate
```cmd
openssl x509 -in server.crt -noout -subject -issuer -dates
```

### Step C: Start the TLS Server (First CMD Window)
```cmd
openssl s_server -accept 4433 -cert server.crt -key server.key -www
```
*(Leave this window running! It acts as a secure HTTPS/TLS server on port 4433).*

### Step D: Connect the TLS Client (Second CMD Window)
```cmd
openssl s_client -connect localhost:4433 -servername localhost -showcerts
```

### Step E: Send HTTP GET Request
Once the handshake completes and client terminal awaits input, type:
```http
GET / HTTP/1.0
```
Then press **Enter twice**.

---

## 3. Handshake Analysis & Actual Result

When the client connects, OpenSSL prints the negotiated cryptographic parameters:

| Parameter | Observed Result | Explanation |
| :--- | :--- | :--- |
| **TLS Version** | `TLSv1.3` | Modern 1-RTT handshake protocol with legacy ciphers eliminated. |
| **Cipher Suite** | `TLS_AES_256_GCM_SHA384` | Authenticated Encryption with AES-256 in Galois/Counter Mode. |
| **Server Key** | `RSA 2048-bit` | Public key algorithm used in the X.509 server certificate. |
| **Key Exchange** | `X25519MLKEM768` / `X25519` | Ephemeral Elliptic Curve Diffie-Hellman / Post-quantum hybrid exchange. |
| **HTTP Response** | `HTTP/1.0 200 ok` | Server successfully processed the encrypted request and returned response. |

### Note on Verification Code 18:
You will observe:
```
Verify return code: 18 (self-signed certificate)
```
**Why this happens:** The certificate was generated locally without being signed by a trusted public Certificate Authority (like Let's Encrypt or DigiCert). The TLS handshake still successfully completes encryption and confidentiality is established, but the client flags that trust cannot be externally verified.

---

## 4. Viva / Oral Questions & Answers
- **Q1: What are the main improvements in TLS 1.3 over TLS 1.2?**  
  *Answer:* TLS 1.3 dropped obsolete, insecure ciphers (RC4, 3DES, CBC-mode ciphers, static RSA key exchange), mandates forward secrecy (ephemeral Diffie-Hellman), and reduced handshake latency from 2-RTT to 1-RTT (or 0-RTT resumption).
- **Q2: Why does `s_server -www` return an HTTP 200 OK page?**  
  *Answer:* The `-www` switch instructs `s_server` to act as an internal HTTP web server that generates an HTML status page displaying the negotiated cipher, certificate chain, and SSL session parameters.
- **Q3: What does Forward Secrecy mean in TLS?**  
  *Answer:* It means session encryption keys are derived ephemerally for each session. Even if an attacker records encrypted traffic and later compromises the server's private key, they cannot retroactively decrypt past recorded sessions.
