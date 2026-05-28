**Tài liệu Config & Security (đã cập nhật)**

Tài liệu mô tả chi tiết từng file trong hai package `Config` và `Security` của dự án `LearnDevOps`.

Trạng thái hiện tại:

- `Config/CorsConfig.java` đã được xoá.
- CORS hiện được quản lý tại `SecurityConfig` thông qua bean `CorsConfigurationSource`.

---

## 1) Config Layer

### `Config/BCryptConfig.java`

- **Mục đích:** tạo bean mã hoá mật khẩu để dùng xuyên suốt ứng dụng.
- **Chức năng chính:**
  - Khai báo `@Configuration`.
  - Tạo bean `BCryptPasswordEncoder` qua method `passwordEncoder()`.
- **Ý nghĩa:** các service đăng ký/đăng nhập có thể inject trực tiếp encoder này để hash và verify mật khẩu.

### `Config/WebSocketConfig.java`

- **Mục đích:** cấu hình STOMP over WebSocket cho realtime messaging.
- **Chức năng chính:**
  - `@EnableWebSocketMessageBroker`: bật message broker cho WebSocket.
  - `configureMessageBroker(...)`:
    - `enableSimpleBroker("/topic")`: client subscribe dữ liệu từ server qua prefix `/topic`.
    - `setApplicationDestinationPrefixes("/app")`: client gửi message vào app qua prefix `/app`.
  - `registerStompEndpoints(...)`:
    - Đăng ký endpoint handshake `/ws`.
    - Gắn `jwtHandshakeInterceptor` để xác thực token ngay lúc mở kết nối socket.
    - Bật SockJS fallback (`withSockJS()`).
    - `setAllowedOriginPatterns("*")` đang mở wildcard cho origin.
- **Lưu ý bảo mật:** nên thay wildcard origin bằng danh sách domain frontend thật khi lên production.

---

## 2) Security Layer

### `Security/SecurityConfig.java`

- **Mục đích:** cấu hình toàn bộ pipeline bảo mật HTTP cho Spring Security.
- **Chức năng chính:**
  - `securityFilterChain(HttpSecurity http)`:
    - Bật CORS theo cấu hình mặc định (`http.cors(Customizer.withDefaults())`).
    - Tắt CSRF (`csrf.disable`) cho mô hình API/JWT.
    - Rule authorize:
      - Cho phép preflight: `OPTIONS /**`.
      - Cho phép public endpoints: `/auth/**`, `/ws/**`, `/app/**`, `/topic/**`, `/sockjs/**`.
      - Tất cả endpoint còn lại phải authenticated.
    - Gắn `JwtFilter` trước `UsernamePasswordAuthenticationFilter`.
  - `corsConfigurationSource()`:
    - Cấu hình origin: `http://localhost:5173`, `http://localhost:5174`.
    - Method cho phép: `GET, POST, PUT, DELETE, PATCH, OPTIONS`.
    - Header cho phép: `*`.
    - `allowCredentials(true)`.
    - Áp dụng cho toàn bộ path `/**`.
- **Ý nghĩa:** sau khi xoá `CorsConfig`, đây là nơi duy nhất điều khiển CORS của API theo Security filter chain.

### `Security/JwtService.java`

- **Mục đích:** đóng gói logic tạo token và parse token JWT.
- **Chức năng chính:**
  - Tạo khóa HMAC từ `SECRET_KEY`.
  - `generateToken(String id)`:
    - set `subject = id`.
    - set `issuedAt`.
    - set `expiration = 1 giờ`.
    - ký bằng secret key.
  - `extractIdUser(String token)`:
    - parse JWT và trả lại `subject` làm user id.
- **Lưu ý bảo mật:** `SECRET_KEY` đang hard-code trong mã; nên chuyển ra biến môi trường hoặc secret manager.

### `Security/JwtFilter.java`

- **Mục đích:** xác thực JWT cho HTTP request thông thường (REST API).
- **Chức năng chính (`doFilterInternal`)**:
  - Đọc header `Authorization`.
  - Nếu không có bearer token thì cho đi tiếp filter chain.
  - Nếu có token thì parse lấy user id bằng `JwtService`.
  - Tạo `UsernamePasswordAuthenticationToken` và set vào `SecurityContextHolder`.
  - Cho request tiếp tục vào controller/service.
- **Giới hạn hiện tại:** authorities để rỗng (`new ArrayList<>()`), nên chưa có phân quyền role-based chi tiết.

### `Security/JwtHandshakeInterceptor.java`

- **Mục đích:** xác thực JWT cho WebSocket handshake (khác luồng HTTP REST thông thường).
- **Chức năng chính (`beforeHandshake`)**:
  - Tìm token từ:
    - header `Authorization: Bearer ...`, hoặc
    - query param `token` / `access_token`.
  - Nếu thiếu token hoặc token lỗi: trả `401 UNAUTHORIZED`, chặn mở socket.
  - Nếu hợp lệ: lấy `userId` và lưu vào `attributes` của WebSocket session.
- **Ý nghĩa:** đảm bảo chỉ client hợp lệ mới mở được WebSocket session.

---

## 3) Vì sao cần cả `JwtFilter` và `JwtHandshakeInterceptor`?

- `JwtFilter` xử lý **HTTP request** trong Security filter chain.
- `JwtHandshakeInterceptor` xử lý **WebSocket handshake** khi client nâng cấp kết nối sang WS/SockJS.

Nói cách khác, hai thành phần phục vụ hai luồng khác nhau:

- API REST: đi qua `JwtFilter`.
- Realtime socket: xác thực khi handshake qua `JwtHandshakeInterceptor`.

Nếu chỉ có `JwtFilter`, bạn vẫn có thể thiếu lớp kiểm tra phù hợp cho vòng đời kết nối WebSocket/SockJS.

---

## 4) Khuyến nghị tiếp theo

- Chuyển `SECRET_KEY` ra cấu hình môi trường.
- Cân nhắc map roles/authorities trong `JwtFilter` nếu cần RBAC.
- Giới hạn `allowedOriginPatterns` của WebSocket theo domain thật khi deploy.
