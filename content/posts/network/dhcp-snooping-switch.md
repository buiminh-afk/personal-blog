---
title: 'Securing Layer 2: DHCP Snooping Deep Dive'
date: '2024-03-15'
status: 'TECHNICAL'
tags: ['Networking', 'Security', 'Cisco']
summary: 'Preventing rogue DHCP servers in enterprise environments using hardware-based snooping techniques.'
---

# Securing Layer 2: DHCP Snooping Deep Dive

DHCP snooping is a security feature that acts like a firewall between untrusted hosts and trusted DHCP servers.

## Why it matters
Without it, an attacker can connect a rogue DHCP server to your network and perform Man-in-the-Middle attacks.

### Core Benefits
- Prevents unauthorized DHCP servers
- Builds a DHCP binding database
- Rate limits DHCP traffic

## Implementation
```bash
ip dhcp snooping
ip dhcp snooping vlan 10
interface GigabitEthernet0/1
 ip dhcp snooping trust
```
