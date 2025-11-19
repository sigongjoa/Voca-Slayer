# Phase 1 구현 상세 내역

**작성일**: 2025-11-20

---

## 1. 컴포넌트 구현

### 1.1 InputScreen.jsx
**목적**: 게임 시작을 위한 사용자 입력 수집

**주요 기능**:
- 영웅 이름 입력
- 타겟 단어 3개 입력
- 장르 선택 (Fantasy, Science Fiction, School Horror)
- 입력 유효성 검사
- 애니메이션 효과

**상태 관리**:
```javascript
const [heroName, setHeroName] = useState('Cheolsu');
const [targetWords, setTargetWords] = useState(['', '', '']);
const [selectedGenre, setSelectedGenre] = useState('fantasy');
const [error, setError] = useState('');
```

**유효성 검사**:
- 영웅 이름 필수
- 3개 단어 모두 필수
- 빈 문자열 체크

---

### 1.2 StoryScreen.jsx
**목적**: AI 생성 스토리 표시

**주요 기능**:
- 챕터 제목 표시
- 스토리 본문 렌더링 (HTML 태그 지원)
- 타겟 단어 하이라이팅 (`<b>` 태그)
- 이미지 프롬프트 표시 (디버깅용)
- 다음 단계 버튼

**Props**:
```javascript
{
  story: {
    title: string,
    content: string (HTML),
    summary: string,
    image_prompt: string,
    quiz: object
  },
  onNext: function
}
```

---

### 1.3 QuizScreen.jsx
**목적**: 보스 전투 및 퀴즈 풀이

**주요 기능**:
- HP 표시 (하트 아이콘)
- 보스 몬스터 비주얼
- 퀴즈 질문 및 선택지
- 정답/오답 피드백
- 애니메이션 효과 (흔들림, 색상 변화)

**Props**:
```javascript
{
  quiz: {
    question: string,
    options: string[],
    answer: string
  },
  hp: number,
  maxHp: number,
  onAnswer: function(isCorrect)
}
```

**로직**:
1. 사용자가 선택지 선택
2. "Attack!" 버튼 클릭
3. 정답 확인
4. 1.5초 후 결과 전달

---

### 1.4 ActionInputScreen.jsx
**목적**: 다음 챕터를 위한 사용자 행동 입력

**주요 기능**:
- 자유 텍스트 입력
- 제안된 행동 버튼 (빠른 선택)
- 입력 유효성 검사

**제안 행동**:
- "탐험을 계속한다"
- "숨겨진 방을 찾는다"
- "적과 싸운다"
- "아이템을 사용한다"

---

### 1.5 ResultScreen.jsx
**목적**: 게임 종료 화면

**주요 기능**:
- 승리/패배 표시
- 완료한 챕터 수 표시
- 등급 표시 (S/F)
- 재시작 버튼

**Props**:
```javascript
{
  isVictory: boolean,
  turn: number,
  onRestart: function
}
```

---

## 2. 상태 관리 (GameContext)

### 2.1 초기 상태
```javascript
{
  gameState: 'INPUT', // INPUT, LOADING, STORY, QUIZ, ACTION_INPUT, RESULT
  userData: {
    heroName: '',
    targetWords: ['', '', ''],
    genre: 'Fantasy'
  },
  rpgState: {
    turn: 1,
    hp: 3,
    maxHp: 3,
    history: [],
    isGameOver: false
  },
  currentStory: null,
  error: null
}
```

### 2.2 액션 타입
- `START_GAME`: 게임 시작
- `SET_STORY`: 스토리 설정
- `NEXT_STAGE_READY`: 퀴즈로 전환
- `QUIZ_SUCCESS`: 퀴즈 정답
- `QUIZ_FAIL`: 퀴즈 오답 (HP 감소)
- `NEXT_TURN_START`: 다음 챕터 시작
- `RESET_GAME`: 게임 초기화
- `SET_ERROR`: 에러 설정

---

## 3. LLM 통합

### 3.1 OpenAI (llm.js)
**모델**: gpt-4o-mini

**설정**:
```javascript
{
  model: 'gpt-4o-mini',
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
}
```

**환경 변수**:
- `VITE_OPENAI_API_KEY`

---

### 3.2 Ollama (llm-ollama.js)
**모델**: llama2

**API 엔드포인트**: `http://localhost:11434/api/generate`

**설정**:
```javascript
{
  model: 'llama2',
  prompt: combinedPrompt,
  stream: false,
  format: 'json'
}
```

**장점**:
- 로컬 실행 (API 키 불필요)
- 무료
- 프라이버시 보호

**단점**:
- 생성 속도 느림 (30-60초)
- 품질이 GPT-4o-mini보다 낮을 수 있음

---

## 4. 시스템 프롬프트

### 4.1 역할
"JSON-speaking fantasy novelist engine for 5th graders"

### 4.2 제약 조건
1. **길이**: 약 600자 (한글)
2. **타겟 단어**: 3개 모두 자연스럽게 포함
3. **하이라이팅**: `<b>` 태그로 감싸기
4. **퀴즈**: 
   - 스토리 맥락 기반
   - 선택지 = 타겟 단어 3개
   - 정답은 선택지 중 하나
5. **언어**: 한글
6. **톤**: 흥미진진, 몰입감, 10-12세 적합
7. **연속성**: 
   - `previousContext` 제공 시 이어서 작성
   - `userAction` 제공 시 즉시 반영

### 4.3 출력 형식
```json
{
  "title": "챕터 제목",
  "content": "스토리 본문 (<b>단어</b> 포함)",
  "summary": "3문장 요약 (다음 챕터용)",
  "image_prompt": "영어 장면 설명 (Anime/Webtoon 스타일)",
  "quiz": {
    "question": "질문",
    "options": ["단어1", "단어2", "단어3"],
    "answer": "정답"
  }
}
```

---

## 5. 테스트 전략

### 5.1 유닛 테스트
**도구**: Vitest, React Testing Library

**테스트 파일**:
- `llm.test.js`: LLM 서비스 로직
- `InputScreen.test.jsx`: 입력 화면 UI
- `useGameLogic.test.js`: 게임 로직 훅

**커버리지**:
- LLM 파라미터 검증
- API 호출 모킹
- 에러 처리
- 입력 유효성 검사
- 상태 전환

---

### 5.2 E2E 테스트
**도구**: Playwright

**테스트 시나리오**:
1. **초기 화면 렌더링**
   - 제목 확인
   - 입력 필드 확인
2. **유효성 검사**
   - 빈 입력 제출 시 에러 메시지
3. **폼 제출**
   - 모든 필드 입력
   - 제출 후 상태 변화
4. **장르 전환**
   - 3개 장르 버튼 클릭
   - 선택 상태 변화

**스크린샷**:
- 9개 자동 생성
- `e2e/screenshots/` 폴더에 저장

---

## 6. UI/UX 디자인

### 6.1 디자인 시스템
**색상 팔레트**:
- Primary: Blue (400-600)
- Secondary: Purple (400-600)
- Success: Green (400-600)
- Error: Red (400-600)
- Background: Slate (800-950)

**타이포그래피**:
- 제목: 3xl, bold, gradient
- 본문: lg, regular
- 라벨: sm, medium

---

### 6.2 애니메이션
**Framer Motion 사용**:
- `initial`: 초기 상태
- `animate`: 최종 상태
- `transition`: 전환 설정

**예시**:
```javascript
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
```

---

### 6.3 반응형 디자인
**브레이크포인트**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**컨테이너**:
- `max-w-md`: 입력 화면
- `max-w-2xl`: 스토리/퀴즈 화면

---

## 7. 성능 고려사항

### 7.1 현재 구현
- ✅ React Context API (전역 상태)
- ✅ 컴포넌트 분리 (재사용성)
- ✅ Lazy loading (이미지 없음)

### 7.2 개선 가능 영역
- [ ] React.memo (불필요한 리렌더링 방지)
- [ ] useMemo/useCallback (함수 메모이제이션)
- [ ] 코드 스플리팅 (번들 크기 감소)
- [ ] 이미지 최적화 (추후 이미지 추가 시)

---

## 8. 보안 고려사항

### 8.1 현재 구현
- ⚠️ `dangerouslySetInnerHTML` 사용 (스토리 렌더링)
  - **위험**: XSS 공격 가능
  - **완화**: LLM이 신뢰할 수 있는 소스
  - **개선**: DOMPurify 라이브러리 사용 고려

- ⚠️ `dangerouslyAllowBrowser: true` (OpenAI)
  - **위험**: API 키 노출
  - **완화**: 프로토타입 단계
  - **개선**: 백엔드 프록시 사용

### 8.2 권장 사항
- [ ] API 키를 백엔드로 이동
- [ ] HTML sanitization 추가
- [ ] CORS 정책 설정
- [ ] Rate limiting 구현

---

## 9. 배포 고려사항

### 9.1 환경 변수
**필수**:
- `VITE_OPENAI_API_KEY` (OpenAI 사용 시)

**선택**:
- `VITE_OLLAMA_URL` (Ollama URL 커스터마이징)

### 9.2 빌드
```bash
npm run build
```

**출력**: `dist/` 폴더

### 9.3 배포 옵션
- **Vercel**: 추천 (Vite 지원)
- **Netlify**: 가능
- **GitHub Pages**: 가능 (SPA 라우팅 설정 필요)
- **자체 서버**: Nginx/Apache

---

## 10. 알려진 이슈 및 제한사항

### 10.1 현재 이슈
1. **Ollama 생성 속도**: 30-60초 소요
   - **해결**: 로딩 메시지 표시
   - **개선**: 스트리밍 응답 구현

2. **이미지 미구현**: `image_prompt` 생성만 됨
   - **해결**: Phase 2에서 구현 예정

3. **저장 기능 없음**: 게임 진행 저장 불가
   - **해결**: Phase 2에서 localStorage 구현

### 10.2 제한사항
- 한국어 전용 (다국어 미지원)
- 단일 플레이어 (멀티플레이 없음)
- 오프라인 모드 없음 (LLM 필요)

---

## 11. 코드 품질

### 11.1 린팅
- ESLint 설정
- Prettier 권장

### 11.2 타입 체크
- 현재: PropTypes 없음
- 개선: TypeScript 마이그레이션 고려

### 11.3 코드 스타일
- 함수형 컴포넌트
- Hooks 사용
- 명확한 네이밍

---

**작성자**: Antigravity AI  
**검토일**: 2025-11-20
