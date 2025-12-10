---
title: "Dynamic Trunking Protocol (DTP) Overview"
date: 2025-03-02
category: "CCNP"
tags: [dtp, vlan, switching, cisco]
description: "Technical overview of Cisco Dynamic Trunking Protocol, its operational modes, risks, and best practices"
---

# Dynamic Trunking Protocol (DTP)

Dynamic Trunking Protocol is a Cisco-proprietary mechanism that negotiates whether a switchport becomes an IEEE 802.1Q trunk or stays as an access port. It works at Layer 2 and exchanges **DTP frames** to determine the final operational mode between two connected interfaces.

## Why DTP Exists
Before automation on switching gear was common, administrators used DTP to dynamically form trunk links between switches without manually configuring every port. It’s still around on many Cisco platforms, but in most secure environments it's disabled to avoid unintended trunk formation.

## Operational Modes

| Mode        | Behavior |
|-------------|----------|
| **dynamic desirable** | Actively tries to form a trunk. Sends DTP. |
| **dynamic auto** | Passive. Forms a trunk only if the neighbor is desirable. |
| **trunk** | Forces trunk mode. Still sends DTP unless `switchport nonegotiate` is used. |
| **access** | Forces access mode. Does not form a trunk but may still send DTP unless `nonegotiate` is applied. |
| **nonegotiate** | Stops DTP from being sent. Only works with static trunk or static access. |

## Negotiation Logic (Simplified)

- desirable ↔ desirable → trunk  
- desirable ↔ auto → trunk  
- auto ↔ auto → stays access  
- trunk ↔ auto/desirable → trunk  
- trunk ↔ trunk → trunk  

If both ends run DTP, they exchange *DTP Type-Length-Value (TLV)* frames on VLAN 1 by default.

## Packet-Level Notes

DTP frames:
- Ethernet Type: **0x2004**
- Destination MAC (common): `01:00:0C:CC:CC:CC`
- Contain TLVs such as:
  - **Domain TLV** (VTP domain)
  - **Status TLV** (access/trunk)
  - **DTP Type TLV**

Useful when you're capturing packets during switch interoperability or troubleshooting trunk negotiation.

## Security Considerations

Leaving ports in *dynamic auto/desirable* opens the door for VLAN hopping via trunk negotiation. An attacker can emulate DTP and force the switch into trunk mode, gaining access to multiple VLANs.

**Hardening tips:**
- Lock down user-facing ports to `switchport mode access`.
- Add `switchport nonegotiate` to stop DTP emissions.
- Enable features like BPDU Guard, DHCP Snooping, and port ACLs on edge ports.

## Example Cisco Config

```cli
# Disable DTP and force access mode
interface GigabitEthernet0/12
  switchport mode access
  switchport nonegotiate
  switchport access vlan 20
  spanning-tree portfast
