# 🛡️ LinkGuard Extension – Malicious Link Detection

## 📌 Mô tả dự án

🔗 **LinkGuard Extension** là một **browser extension** giúp người dùng **phát hiện và cảnh báo link độc hại (malicious URL)** trước khi truy cập.

Dự án tập trung giải quyết bài toán **phishing và malicious links** thông qua **hai cơ chế bảo vệ cốt lõi**:

1. Phân tích link khi người dùng **bôi đen văn bản**
2. Cảnh báo và chặn link **ngay tại thời điểm click**

🎯 Mục tiêu:

- Bảo vệ người dùng khỏi click nhầm link độc
- Cung cấp đánh giá **có giải thích** (explainable security)
- Trải nghiệm tự nhiên, không làm gián đoạn hành vi duyệt web

---

## Tính năng chính

### Feature 1 – Bôi đen link để phân tích

**Text Selection URL Analysis**

- Người dùng bôi đen một chuỗi văn bản nghi là URL
- Extension tự động:
  - Nhận diện URL (URL extraction)
  - Phân tích mức độ an toàn
  - Hiển thị kết quả dưới dạng popup/tooltip
- Không cần click → giảm rủi ro bảo mật

---

### Feature 2 – Cảnh báo khi click link

**Click Interception Protection**

- Khi người dùng click vào bất kỳ link nào:
  - URL được phân tích trước khi điều hướng
  - Nếu nguy hiểm → chặn và hiển thị cảnh báo
  - Nếu an toàn → redirect bình thường

---

## Tech Stack

### Frontend (Dashboard / UI)

- Next.js
- TypeScript
- i18n (EN / JA / VI)

### Backend (Analysis API)

- NestJS
- TypeScript
- Redis

### Database

- PostgreSQL

### Infrastructure & Tooling

- Docker & docker-compose
- GitHub Actions (CI/CD)
- ESLint + Prettier
- Jest (Unit / Integration Test)

---

## Planning & Estimation

| Ngày   | Nội dung chính                                 | Thời gian ước tính |
| ------ | ---------------------------------------------- | ------------------ |
| Day 1  | Tạo repo, cấu trúc dự án, README               | 4–5h               |
| Day 2  | Docker, ESLint, Prettier, setup môi trường     | 5–6h               |
| Day 3  | Thiết kế database, migration PostgreSQL        | 5–6h               |
| Day 4  | API phân tích URL, Risk Scoring Engine         | 6–7h               |
| Day 5  | Unit test backend, setup CI (GitHub Actions)   | 5–6h               |
| Day 6  | Setup browser extension (Manifest V3)          | 5–6h               |
| Day 7  | Feature bôi đen link (text selection analysis) | 6–7h               |
| Day 8  | Feature chặn & cảnh báo khi click link         | 5–6h               |
| Day 9  | UI hiển thị kết quả, whitelist, caching        | 5–6h               |
| Day 10 | Integration test, polish UX, hoàn thiện docs   | 5–6h               |

## Run project

Đứng tại root chạy command dưới đây (Note: bật docker engine)

- Cho lần đầu chạy (sửa Dockerfile hoặc rebuild environment)

  > docker compose up --build

- Từ lần sau chạy
  > docker compose up
