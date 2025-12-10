---
title: "Static Routes, Floating Static Routes, and Null Routes"
date: 2025-03-02
category: "CCNP"
tags: [static-routing, routing, cisco, ccnp, encor]
description: "Technical overview of static routing in Cisco networks, including fully specified static routes, floating static routes, and null routes with best practices."
---

# Static Routes, Floating Static Routes, and Null Routes

Static routing is the most deterministic form of routing: the network engineer manually defines the path a packet should take. Unlike dynamic routing protocols, static routes do not learn or adapt based on network state — they exist as long as the referenced next-hop or outbound interface is reachable.

Static routes are foundational in enterprise designs, especially at network edges, WAN spokes, and controlled environments where predictability is more important than convergence speed.

## Why Static Routes Matter

Static routing is still widely used in modern networks because:

- **Zero protocol overhead**: no hello timers, no LSAs, no neighbor adjacency load.
- **Highly predictable** forwarding behavior.
- **Security boundary control**: useful at edges where routing information should not be exchanged.
- **Simple redistribution** into dynamic routing protocols.
- **Fast lookup** (installed directly in RIB/FIB).

Static routes do not react to topology changes unless the interface goes down or the next-hop becomes unreachable.



## Types of Static Routes

Cisco ENCOR defines three main forms of static routes, plus a common extension (floating static). These variants determine how the router resolves the next-hop and when the route is considered valid.

### Directly Connected Static Route

A static route that **only specifies the outbound interface**:

```cli
ip route 10.10.0.0 255.255.0.0 Serial0/0
```

**Notes:**

* Typically used on point-to-point serial links.
* Not recommended on Ethernet interfaces — can cause excessive ARP resolution and CPU load.
* The route is removed from the RIB when the interface goes down.

### Recursive Static Route

A static route that **only specifies a next-hop IP**:

```cli
ip route 10.10.0.0 255.255.0.0 192.168.1.1
```

**Characteristics:**

* Router performs a *recursive lookup*:
  *“How do I reach the next-hop 192.168.1.1?”*
* Route only stays in RIB if the next-hop is resolvable.
* Cleaner in Ethernet networks but can add lookup overhead.

### Fully Specified Static Route

A static route that defines **both outbound interface and next-hop**:

```cli
ip route 10.10.0.0 255.255.0.0 192.168.1.1 GigabitEthernet0/0
```

**Benefits:**

* Eliminates recursive lookup.
* Route is removed from RIB if the interface goes down.
* Preferred in many enterprise designs due to deterministic behavior.



## Floating Static Routes

Floating static routes are static routes configured with an **administrative distance (AD) higher** than the primary route. They function as *backup routes*.

```cli
ip route 10.10.0.0 255.255.0.0 192.168.100.1 200
```

**How they work:**

* Installed in RIB *only when the main route disappears*.
* Useful for WAN failover or Internet backup paths.
* AD must be **greater** than the route learned from dynamic protocols
  (e.g., OSPF AD=110 → floating static AD >110).

**Common use cases:**

* MPLS primary → DIA backup
* IPsec VPN primary → LTE failover
* Providing fallback default routes



## Static Null Routes (Blackhole Routes)

A null route points traffic to `Null0` — a virtual interface that silently drops packets.

```cli
ip route 10.0.0.0 255.0.0.0 Null0
```

### Why Use Null Routes?

* **Prevent routing loops** when summarizing routes.
* **Drop unwanted or spoofed prefixes** quickly without ACL processing.
* **Protect upstream peers** from traffic that shouldn't return.

#### Loop-Prevention Use Case

When summarizing:

```cli
ip route 10.0.0.0 255.0.0.0 Null0
router ospf 10
  area 0 range 10.0.0.0 255.0.0.0
```

Any traffic that matches the summary but not a more-specific route is dropped — stopping the packet from bouncing around the network in search of a destination that doesn't exist.

### Key Properties

* `Null0` is always up.
* Traffic sent to Null0 never generates ICMP unreachable.
* Efficient: does not consume CPU cycles like ACL drops.



## Security & Design Considerations


| Best Practice | Reason / Benefit |
|---------------|------------------|
| **Use static routes at network boundaries** | Prevents leakage of internal prefixes to partners or ISPs. |
| **Combine floating static + IP SLA for robust failover** | Tracks next-hop reachability and automatically activates backup paths. |
| **Always include a Null route when advertising summaries** | Prevents accidental routing loops by dropping traffic that matches the summary but not a more-specific prefix. |
| **Avoid directly connected static routes on Ethernet links** | Eliminates excessive ARP load; use recursive or fully specified static routes instead. |




## Example Configurations

### Static Route (IPv4)

```cli
ip route 172.16.10.0 255.255.255.0 192.168.1.1
```

### Static Route (IPv6)

```cli
ipv6 route 2001:DB8:10::/64 2001:DB8:FF::1
```

### Floating Static Route

```cli
ip route 0.0.0.0 0.0.0.0 203.0.113.1 250
```

### Null Route

```cli
ip route 192.168.0.0 255.255.0.0 Null0
```



## Summary

Static routing remains a core skill for CCNP and production network engineers because of its simplicity, determinism, and usefulness in design patterns such as edge control, summarization, and backup routing. Understanding the nuances between directly connected, recursive, and fully specified static routes—as well as floating static and null routes—is essential for both exams and real-world operations.
