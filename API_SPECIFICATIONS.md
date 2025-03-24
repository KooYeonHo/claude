# GeoHeim Django API - 프론트엔드 개발 요구사항

## 1. 사용자 관리 (User Management)

### 1.1. 사용자 생성/로그인 API
- **URL**: `POST /api/users/`
- **필수 파라미터**: 
  - `cafe24_token`: 사용자 인증 토큰
  - `pets` (선택적): 반려동물 정보 (JSON 객체 배열)
- **응답**:
  - 성공 (201 Created/200 OK): 사용자 ID와 등록된 반려동물 목록
  ```json
  {
    "id": "사용자 UUID",
    "pets": [
      {"id": "pet-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", "petnm": "반려동물 이름"}
    ]
  }
  ```
  - 실패 (400): 오류 메시지

## 2. 채팅 관리 (Chat Management)

### 2.1. 채팅 목록 조회
- **URL**: `GET /api/chats/?userId={userId}&petnm={petnm}&cursor={cursor}&limit={limit}`
- **필수 파라미터**: 
  - `userId`: 사용자 UUID 
  - `petnm`: 반려동물 이름
- **선택적 파라미터**:
  - `cursor`: 페이지네이션을 위한 타임스탬프 (ISO8601 형식)
  - `limit`: 한 번에 가져올 채팅 수 (기본값: 5, 최대: 50)
- **인증**: 필요 (IsAuthenticated)
- **응답**:
  ```json
  {
    "results": [
      {
        "id": "chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "title": "채팅 제목",
        "created_at": "2025-03-13T12:34:56Z",
        "is_shared": false,
        ...
      }
    ],
    "next_cursor": "2025-03-13T12:30:00Z",
    "has_next": true
  }
  ```

### 2.2. 특정 채팅 조회
- **URL**: `GET /api/chats/{chat_id}/?userId={userId}&petnm={petnm}`
- **필수 파라미터**: 
  - `userId`: 사용자 UUID
  - `petnm`: 반려동물 이름
- **인증**: 필요 (IsAuthenticated)
- **응답**: 채팅 정보와 모든 메시지 포함
  ```json
  {
    "id": "chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "title": "채팅 제목",
    "created_at": "2025-03-13T12:34:56Z",
    "is_shared": false,
    "messages": [
      {
        "id": "msg-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "role": "user",
        "content": {"message": "사용자 메시지"},
        "created_at": "2025-03-13T12:34:56Z"
      },
      {
        "id": "msg-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "role": "assistant",
        "content": {"message": "AI 응답"},
        "created_at": "2025-03-13T12:35:00Z"
      }
    ]
  }
  ```

### 2.3. 채팅 공유하기
- **URL**: `POST /api/chats/{chat_id}/share/?userId={userId}&petnm={petnm}`
- **필수 파라미터**: 
  - `userId`: 사용자 UUID
  - `petnm`: 반려동물 이름
- **인증**: 필요 (IsAuthenticated)
- **응답**: 업데이트된 채팅 정보 (is_shared=true)

### 2.4. 채팅 삭제
- **URL**: `DELETE /api/chats/{chat_id}/?userId={userId}&petnm={petnm}`
- **필수 파라미터**: 
  - `userId`: 사용자 UUID
  - `petnm`: 반려동물 이름
- **인증**: 필요 (IsAuthenticated)
- **응답**: 성공 시 204 No Content

### 2.5. 공유된 채팅 보기 (인증 불필요)
- **URL**: `GET /api/shared/{chat_id}/`
- **인증**: 불필요 (AllowAny)
- **응답**: 채팅 정보와 메시지 (is_shared=true인 경우만)
  ```json
  {
    "chat_id": "chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "title": "채팅 제목",
    "created_at": "2025-03-13T12:34:56Z",
    "is_shared": true,
    "messages": [...]
  }
  ```

### 2.6. 공유된 채팅에서 새 대화 시작
- **URL**: `POST /api/shared/{chat_id}/`
- **필수 파라미터**:
  - `userId`: 사용자 UUID
  - `petnm`: 반려동물 이름
  - `message`: 새 메시지 내용
- **응답**: 새 채팅 ID와 리다이렉트 URL
  ```json
  {
    "success": true,
    "message": "새 채팅이 생성되었습니다.",
    "chat_id": "chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "user_id": "사용자 UUID",
    "petnm": "반려동물 이름",
    "redirect_url": "/chat?id=chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX&userId=사용자UUID&petnm=반려동물이름"
  }
  ```

## 3. 메시지 관리 (Message Management)

### 3.1. 메시지 생성 (통합 엔드포인트)
- **URL**: `POST /api/chats/{chat_id}/messages/` 또는 `POST /api/messages/`
- **필수 파라미터**:
  - `userId`: 사용자 UUID
  - `petnm`: 반려동물 이름 
  - `content.message`: 메시지 내용
- **동작 방식**: 
  - URL에 `chat_id`가 포함되면: 기존 채팅에 메시지 추가
  - URL에 `chat_id`가 없으면: 새 채팅 시작 (기존 `/api/chat/start/` 기능)
- **인증**: 불필요 (AllowAny)
- **응답**: 서버-전송 이벤트(SSE) 스트림 (실시간 메시지 응답)
  ```
  data: {"type": "start"}

  data: {"type": "tool_selection", "content": "도구를 선택 중입니다..."}
  
  data: {"type": "tool_selection", "content": {"role": "assistant", "content": "도구 선택 중간 응답..."}}

  data: {"type": "end", "result": {"messages": [...], "next_step": "recipe", "usage": {"prompt_tokens": 123, "completion_tokens": 456}}}

  # 레시피 흐름의 경우
  data: {"type": "recipe_flow", "content": "레시피 생성 중..."}

  data: {"type": "recipe_flow", "content": {"selected_ingredients": ["사과", "당근"], "validation_ingredients": [...]}}

  data: {"type": "new_recipe_message", "recipe_id": "recipe-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"}

  # RAG 흐름의 경우
  data: {"type": "rag_flow", "content": "관련 정보를 검색 중..."}

  data: {"type": "rag_flow", "content": {"search_query": "반려견 비타민 요구량", "search_result": [...]}}

  # 기본 흐름의 경우
  data: {"type": "basic_flow", "content": "답변 생성 중..."}
  
  data: {"type": "basic_flow", "content": {"role": "assistant", "content": "중간 답변 내용..."}}

  # 오류 발생시
  data: {"type": "error", "error": "메시지 처리 중 오류 발생", "detail": "오류 상세 내용"}
  ```

## 4. 레시피 관리 (Recipe Management)

### 4.1. 레시피 목록 조회
- **URL**: `GET /api/recipes/?userId={userId}&cursor={cursor}&limit={limit}`
- **필수 파라미터**: 
  - `userId`: 사용자 UUID
- **선택적 파라미터**:
  - `cursor`: 페이지네이션을 위한 타임스탬프
  - `limit`: 한 번에 가져올 레시피 수 (기본값: 5, 최대: 50)
- **인증**: 필요 (IsAuthenticated)
- **응답**:
  ```json
  {
    "results": [
      {
        "id": "recipe-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "title": "식단 제목",
        "created_at": "2025-03-13T12:34:56Z",
        "selected_ingredients": [...],
        "calculation_result": {...}
      }
    ],
    "next_cursor": "2025-03-13T12:30:00Z",
    "has_next": true
  }
  ```

### 4.2. 특정 레시피 조회
- **URL**: `GET /api/recipes/{recipe_id}/`
- **인증**: 필요 (IsAuthenticated)
- **응답**: 레시피 상세 정보
  ```json
  {
    "id": "recipe-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "title": "식단 제목",
    "created_at": "2025-03-13T12:34:56Z",
    "user_id": "사용자 UUID",
    "validation_ingredients": [...],
    "selected_ingredients": [...],
    "calculation_result": {...}
  }
  ```

## 5. 데이터 모델 구조

### 5.1. 사용자 (User)
- `id`: char (표준 UUID 형식)
- `cafe24_token`: 인증 토큰
- `created_at`: 생성 시간

### 5.2. 반려동물 (Pet)
- `id`: char (pet-XXXXXXXX 접두사 포함 형식)
- `pet_name`: 반려동물 이름
- `pet_info`: 반려동물 정보 (JSON)
- `user_id`: 사용자 ID (외래 키)

### 5.3. 채팅 (Chat)
- `id`: char (chat-XXXXXXXX 접두사 포함 형식)
- `created_at`: 생성 시간
- `user_id`: 사용자 ID (외래 키)
- `pet_id`: 반려동물 ID (pet-XXXXXXXX 형식)
- `title`: 채팅 제목
- `is_shared`: 공유 여부

### 5.4. 메시지 (Message)
- `id`: char (msg-XXXXXXXX 접두사 포함 형식)
- `created_at`: 생성 시간
- `chat_id`: 채팅 ID (외래 키, chat-XXXXXXXX 형식)
- `role`: 메시지 역할 (user/assistant/tool/tool_result/recipe/rag)
- `content`: 메시지 내용 (JSON)
- `token_count`: 토큰 사용량 정보 (JSON)

### 5.5. 레시피 (Recipe)
- `id`: char (recipe-XXXXXXXX 접두사 포함 형식)
- `title`: 레시피 제목
- `created_at`: 생성 시간
- `user_id`: 사용자 ID (외래 키)
- `validation_ingredients`: 검증된 식재료 (JSON)
- `selected_ingredients`: 선택된 식재료 (JSON)
- `calculation_result`: 계산 결과 (JSON)

## 6. 중요 구현 사항

### 6.1. 인증 시스템
- 모든 API에는 인증이 필요하며 대부분 IsAuthenticated 권한이 필요합니다.
- 메시지 생성(POST /api/chat/start/, POST /api/chats/{chat_id}/messages/)과 공유된 채팅 조회(GET /api/shared/{chat_id}/)는 AllowAny 권한으로 인증 없이 접근 가능합니다.

### 6.2. 페이지네이션
- 채팅 목록과 레시피 목록은 커서 기반 페이지네이션을 사용합니다.
- `cursor`는 ISO8601 형식의 타임스탬프입니다.
- 응답에는 `next_cursor`와 `has_next` 필드가 포함됩니다.

### 6.3. 실시간 메시지 처리
- 메시지는 Server-Sent Events(SSE)를 통해 실시간으로 처리되며 클라이언트는 스트림을 수신해야 합니다.
- 메시지 처리 시 다음 단계로 이어지는 처리 과정이 있습니다:
  1. `tool_selection`: 초기 도구 선택 단계로, 사용자 메시지 분석 후 적절한 처리 흐름 결정
  2. `recipe_flow`: 식단 관련 요청이라고 판단된 경우의 처리 흐름
  3. `rag_flow`: 관련 정보 검색이 필요한 요청의 처리 흐름  
  4. `basic_flow`: 일반 대화 처리 흐름
- 각 처리 단계는 다음 타입의 이벤트를 생성합니다:
  - `start`: 처리 시작을 알림
  - `[flow_type]`: 현재 진행 중인 처리 흐름 상태 업데이트
  - `end`: 특정 처리 흐름 완료 및 다음 단계 안내
  - `new_recipe_message`: 새 레시피가 생성된 경우
  - `error`: 처리 중 오류 발생 시

### 6.4. 오류 처리
- 모든 API는 적절한 오류 응답과 함께 HTTP 상태 코드를 반환합니다.
- 스트리밍 응답에서는 오류가 JSON 객체로 인코딩되어 반환됩니다.
- 예: `data: {"type": "error", "error": "메시지 처리 중 오류 발생", "detail": "오류 상세 내용"}`

### 6.5. 레시피 기능
- 레시피는 식재료 기반 영양분석 기능을 제공합니다.
- 선택된 식재료와 계산 결과가 저장됩니다.
- 레시피가 생성되면 해당 레시피 ID가 메시지 스트림에 포함됩니다.

### 6.6. ID 형식 유의사항
- 모든 ID는 접두사가 포함된 UUID 형태입니다:
  - User ID: 표준 UUID 형식
  - Pet ID: `pet-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` 형식 (char)
  - Chat ID: `chat-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` 형식 (char)
  - Message ID: `msg-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` 형식 (char)
  - Recipe ID: `recipe-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` 형식 (char)
- 요청 및 응답 처리 시 이러한 ID 형식을 정확히 따라야 합니다.

## 7. 활용 방법

이 API는 반려동물 영양 관리를 위한 챗봇 시스템으로, 다음과 같은 기능을 제공합니다:

1. **사용자 관리**: cafe24 토큰을 통한 사용자 인증
2. **반려동물 관리**: 사용자별 다수의 반려동물 정보 관리
3. **채팅 기능**: 반려동물 영양 상담을 위한 대화형 인터페이스
4. **레시피 생성**: 반려동물 맞춤형 식단 및 영양 분석
5. **채팅 공유**: 유용한 대화 내용 공유 및 복제 기능

프론트엔드 개발 시 SSE(Server-Sent Events) 지원과 커서 기반 페이지네이션 처리에 주의해야 합니다.

## 8. 상세 SSE 응답 처리 가이드

메시지 생성 API(`POST /api/messages/` 또는 `POST /api/chats/{chat_id}/messages/`)는 서버-전송 이벤트(SSE)를 사용하여 실시간으로 응답을 클라이언트에 전달합니다. 프론트엔드에서 이를 올바르게 처리하기 위해 각 처리 흐름별 SSE 이벤트 유형을 이해해야 합니다.

### 8.1 공통 이벤트

모든 처리 흐름에서 공통적으로 사용되는 이벤트:

- **시작**: `{"type": "start"}` - 모든 처리의 시작점
- **오류**: `{"type": "error", "error": "오류 메시지", "detail": "상세 내용"}`
- **종료**: `{"type": "end", "result": {...}}` - 처리 완료 및 최종 결과

### 8.2 도구 선택 단계 (Tool Selection)

도구 선택 단계에서는 사용자 질문을 분석하여 적절한 처리 흐름(레시피, RAG, 기본 대화)을 결정합니다.