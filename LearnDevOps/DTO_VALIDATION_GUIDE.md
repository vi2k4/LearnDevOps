## DTO + Validation + Error Handling Documentation

### Overview
Đã thêm hệ thống chuẩn hóa API response với DTO, bean validation, và global exception handler cho tất cả các endpoint.

---

## 1. DTOs Added

### Auth Flow
- **LoginDto**: Email + Password (với validation)
- **RegisterDto**: Username, Email, Password, Avatar tùy chọn (với validation)
- **AuthResponseDto**: Trả về message, token, user info (UserResponseDto)
- **UserResponseDto**: User information (không lộ password, ID, email nhạy cảm)

### Message & Conversation
- **ConversationRequestDto**: Type (required), Name (optional)
- **ConversationResponseDto**: ID, Type, Name, CreatedAt
- **MessageRequestDto**: SenderId, ConversationId, Content (required), Type, IsDeleted, IsEdited
- **MessageResponseDto**: ID, SenderId, SenderUsername, ConversationId, Content, Type, IsDeleted, IsEdited, CreatedAt

### Error Handling
- **ErrorResponseDto**: HTTP status code, message, error type, timestamp, path, validation errors map

---

## 2. Custom Exceptions

```java
com.example.LearnDevOps.Exception.*
├── DuplicateEmailException      // 409 Conflict
├── UserNotFoundException        // 404 Not Found
└── InvalidPasswordException     // 401 Unauthorized
```

---

## 3. Global Exception Handler

**File**: `com.example.LearnDevOps.Advice.GlobalExceptionHandler`

Xử lý tự động:
- Validation errors (@Valid) → 400 Bad Request (+ validation error map)
- DuplicateEmailException → 409 Conflict
- UserNotFoundException → 404 Not Found
- InvalidPasswordException → 401 Unauthorized
- General exceptions → 500 Internal Server Error

**Response format**:
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "timestamp": "2026-05-22T22:15:00",
  "path": "/auth/register",
  "validationErrors": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## 4. Updated Endpoints

### Auth Endpoints
**POST /auth/register**
- Request: RegisterDto (với validation)
- Response: AuthResponseDto (201 Created)

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john@example.com",
    "password": "securepass123",
    "avatar": "https://example.com/john.jpg"
  }'
```

**POST /auth/login**
- Request: LoginDto (với validation)
- Response: AuthResponseDto (200 OK) hoặc ErrorResponse (401/404)

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### User Endpoints
**GET /users/me** (requires authentication)
- Response: UserResponseDto (200 OK) hoặc 404

```bash
curl -X GET http://localhost:8080/users/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Conversation Endpoints
**POST /conversations**
- Request: ConversationRequestDto (201 Created)
```bash
curl -X POST http://localhost:8080/conversations \
  -H "Content-Type: application/json" \
  -d '{"type": "group", "name": "Dev Team"}'
```

**GET /conversations** → List (200 OK)
**GET /conversations/{id}** → Detail (200 OK hoặc 404)
**PUT /conversations/{id}** → Update (200 OK hoặc 404)
**DELETE /conversations/{id}** → Delete (204 No Content)

### Message Endpoints
**POST /messages**
- Request: MessageRequestDto (201 Created)
```bash
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "conversationId": 1,
    "content": "Hello everyone!",
    "type": "text",
    "isDeleted": false,
    "isEdited": false
  }'
```

**GET /messages** → List (200 OK)
**GET /messages/{id}** → Detail (200 OK hoặc 404)
**GET /messages/conversation/{conversationId}** → By conversation
**GET /messages/sender/{senderId}** → By sender
**PUT /messages/{id}** → Update (200 OK hoặc 404)
**DELETE /messages/{id}** → Delete (204 No Content)

---

## 5. Error Response Examples

### Validation Error (400)
```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "timestamp": "2026-05-22T22:15:30",
  "path": "/auth/register",
  "validationErrors": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters",
    "username": "Username must be between 3 and 50 characters"
  }
}
```

### Duplicate Email (409)
```json
{
  "status": 409,
  "message": "Email already exists: john@example.com",
  "error": "DUPLICATE_EMAIL",
  "timestamp": "2026-05-22T22:15:45",
  "path": "/auth/register"
}
```

### User Not Found (404)
```json
{
  "status": 404,
  "message": "User not found with email: notfound@example.com",
  "error": "USER_NOT_FOUND",
  "timestamp": "2026-05-22T22:16:00",
  "path": "/auth/login"
}
```

### Invalid Password (401)
```json
{
  "status": 401,
  "message": "Invalid password for email: john@example.com",
  "error": "INVALID_PASSWORD",
  "timestamp": "2026-05-22T22:16:15",
  "path": "/auth/login"
}
```

---

## 6. Running the Application

### Start the server
```bash
./mvnw.cmd spring-boot:run
# or
java -jar target/LearnDevOps-0.0.1-SNAPSHOT.jar
```

Server sẽ chạy tại: http://localhost:8080

### API Documentation
Swagger UI (nếu có springdoc-openapi): http://localhost:8080/swagger-ui.html

---

## 7. Next Steps (Optional)

1. **Extend DTOs** cho các entities khác (Friend, Notification, Report, etc.)
2. **Add pagination** cho endpoints list (ConversationController, MessageController)
3. **Add more custom endpoints** (ví dụ: gửi message + notification)
4. **Add security checks** (authorization per user, role-based)
5. **Add unit/integration tests** cho services

---

## Summary of Changes

| File | Type | Action |
|------|------|--------|
| LoginDto.java | DTO | Enhanced với validation |
| RegisterDto.java | DTO | Created |
| UserResponseDto.java | DTO | Created |
| AuthResponseDto.java | DTO | Created |
| ErrorResponseDto.java | DTO | Created |
| ConversationRequestDto.java | DTO | Created |
| ConversationResponseDto.java | DTO | Created |
| MessageRequestDto.java | DTO | Created |
| MessageResponseDto.java | DTO | Created |
| DuplicateEmailException.java | Exception | Created |
| UserNotFoundException.java | Exception | Created |
| InvalidPasswordException.java | Exception | Created |
| GlobalExceptionHandler.java | Advice | Created |
| AuthService.java | Service | Updated (returns DTO, throws exceptions) |
| AuthController.java | Controller | Updated (uses @Valid, DTOs) |
| UserController.java | Controller | Updated (returns UserResponseDto) |
| ConversationService.java | Service | Updated (uses DTOs, mapping) |
| ConversationController.java | Controller | Updated (uses @Valid, DTOs, proper HTTP status) |
| MessageService.java | Service | Updated (uses DTOs, mapping, exception handling) |
| MessageController.java | Controller | Updated (uses @Valid, DTOs, proper HTTP status) |

