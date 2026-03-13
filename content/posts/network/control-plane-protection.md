---
title: 'Hardening Router Control Planes'
date: '2024-01-10'
status: 'INFRA'
tags: ['Infrastructure', 'BGP', 'Security']
summary: 'Best practices for protecting infrastructure management planes from DDoS and unauthorized access.'
---

# Hardening Router Control Planes

The control plane is the "brain" of your router.

## CoPP (Control Plane Policing)
CoPP allows you to rate-limit traffic destined for the CPU. 

```bash
class-map match-any CP-MGMT
 match access-group name ACL-SSH
policy-map COPP-POLICY
 class CP-MGMT
  police 128000
```
