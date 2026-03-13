---
title: 'Encrypted Logging with Syslog-NG and TLS'
date: '2024-02-28'
status: 'SECURITY'
tags: ['DevOps', 'Security', 'Linux']
summary: 'A guide to setting up mutual TLS authentication for centralized logging infrastructure.'
---

# Encrypted Logging with Syslog-NG and TLS

Centralized logging is a gold mine for attackers. If logs are sent in cleartext, they can be intercepted easily.

## Mutual TLS (mTLS)
mTLS ensures that not only is the traffic encrypted, but both verify each other.

```bash
source s_network {
    network(ip(0.0.0.0) port(6514)
    transport("tls")
    tls( key-file("/etc/syslog-ng/cert.d/server.key")
         cert-file("/etc/syslog-ng/cert.d/server.crt"))
    );
};
```
