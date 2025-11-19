# Phase 2: Anki SM-2 알고리즘 통합 명세

**작성일:** 2025-11-20  
**버전:** 2.1

---

## 🧠 개요

Anki의 **SM-2 (SuperMemo 2) 알고리즘**을 게임에 통합하여 간격 반복 학습(Spaced Repetition)을 구현합니다. 이를 통해 학생들이 단어를 효과적으로 장기 기억에 저장할 수 있도록 돕습니다.

---

## 📚 SM-2 알고리즘 이해

### 기본 개념

SM-2 알고리즘은 다음 복습 시점을 계산하여 학습 효율을 극대화합니다:

1. **Easiness Factor (EF)**: 단어의 난이도 (1.3 ~ 2.5)
2. **Interval**: 다음 복습까지의 간격 (일 단위)
3. **Repetitions**: 연속 정답 횟수

### 알고리즘 공식

```
EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

여기서:
- q = 퀴즈 품질 (0-5)
  - 5: 완벽 (즉시 정답)
  - 4: 약간 고민 후 정답
  - 3: 어렵게 정답
  - 2: 틀렸지만 알고 있었음
  - 1: 틀렸고 힌트 필요
  - 0: 완전히 모름

다음 복습 간격:
- I(1) = 1일
- I(2) = 6일
- I(n) = I(n-1) * EF
```

---

## 🎮 게임 통합 전략

### 1. 단어 카드 시스템

#### 1.1 데이터 구조

```typescript
interface WordCard {
  word: string;
  definition: string;
  examples: string[];
  
  // SM-2 알고리즘 데이터
  easinessFactor: number; // 1.3 ~ 2.5, 기본값 2.5
  interval: number; // 다음 복습까지 일수
  repetitions: number; // 연속 정답 횟수
  nextReviewDate: Date; // 다음 복습 날짜
  
  // 학습 통계
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewDate: Date;
  
  // 게임 메타데이터
  firstSeenChapter: number;
  genres: string[]; // 어떤 장르에서 나왔는지
  difficulty: number; // 1-5
}
```

#### 1.2 단어 상태

```typescript
enum CardState {
  NEW = 'NEW',           // 처음 보는 단어
  LEARNING = 'LEARNING', // 학습 중 (repetitions < 2)
  REVIEW = 'REVIEW',     // 복습 중 (repetitions >= 2)
  MASTERED = 'MASTERED'  // 마스터 (EF > 2.3, repetitions > 5)
}
```

### 2. SM-2 알고리즘 구현

#### 2.1 핵심 함수

```typescript
class SM2Algorithm {
  /**
   * SM-2 알고리즘으로 다음 복습 일정 계산
   * @param card - 단어 카드
   * @param quality - 퀴즈 품질 (0-5)
   * @returns 업데이트된 카드
   */
  calculateNextReview(card: WordCard, quality: number): WordCard {
    // 품질이 3 미만이면 처음부터 다시
    if (quality < 3) {
      return {
        ...card,
        repetitions: 0,
        interval: 1,
        nextReviewDate: this.addDays(new Date(), 1),
        incorrectCount: card.incorrectCount + 1,
        totalReviews: card.totalReviews + 1,
        lastReviewDate: new Date()
      };
    }

    // EF 계산
    let newEF = card.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEF = Math.max(1.3, newEF); // 최소값 1.3

    // 간격 계산
    let newInterval: number;
    const newReps = card.repetitions + 1;

    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * newEF);
    }

    return {
      ...card,
      easinessFactor: newEF,
      interval: newInterval,
      repetitions: newReps,
      nextReviewDate: this.addDays(new Date(), newInterval),
      correctCount: card.correctCount + 1,
      totalReviews: card.totalReviews + 1,
      lastReviewDate: new Date()
    };
  }

  /**
   * 복습이 필요한 단어 조회
   */
  getDueCards(cards: WordCard[]): WordCard[] {
    const now = new Date();
    return cards.filter(card => card.nextReviewDate <= now);
  }

  /**
   * 단어 상태 계산
   */
  getCardState(card: WordCard): CardState {
    if (card.totalReviews === 0) return CardState.NEW;
    if (card.repetitions < 2) return CardState.LEARNING;
    if (card.easinessFactor > 2.3 && card.repetitions > 5) return CardState.MASTERED;
    return CardState.REVIEW;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
```

#### 2.2 퀴즈 품질 매핑

게임의 퀴즈 결과를 SM-2 품질 점수로 변환:

```typescript
function mapQuizResultToQuality(
  isCorrect: boolean,
  responseTime: number, // 초
  hintsUsed: number
): number {
  if (!isCorrect) {
    return hintsUsed > 0 ? 1 : 0; // 힌트 사용 여부
  }

  // 정답인 경우 응답 시간으로 품질 결정
  if (responseTime < 5) return 5;  // 즉시 정답
  if (responseTime < 10) return 4; // 빠른 정답
  if (responseTime < 20) return 3; // 고민 후 정답
  return 3; // 기본값
}
```

---

## 🎯 게임 내 통합 방식

### 3. 복습 모드

#### 3.1 일일 복습 시스템

```typescript
interface DailyReview {
  date: Date;
  dueCards: WordCard[];
  newCards: WordCard[]; // 오늘 처음 보는 단어
  reviewedCards: WordCard[]; // 오늘 복습한 단어
  
  stats: {
    totalDue: number;
    completed: number;
    accuracy: number;
    timeSpent: number; // 초
  };
}
```

#### 3.2 복습 화면 UI

```
┌─────────────────────────────────┐
│   Daily Review 📚               │
├─────────────────────────────────┤
│ Due Today: 12 words             │
│ Progress: ████████░░ 8/12       │
├─────────────────────────────────┤
│                                 │
│   Word: 추상화                   │
│                                 │
│   [Show Definition]             │
│                                 │
│   How well did you know it?     │
│   [😫 Again] [🤔 Hard]          │
│   [😊 Good] [😎 Easy]           │
│                                 │
└─────────────────────────────────┘
```

#### 3.3 복습 버튼 매핑

```typescript
const REVIEW_BUTTONS = {
  AGAIN: { quality: 0, label: '다시', emoji: '😫' },
  HARD: { quality: 3, label: '어려움', emoji: '🤔' },
  GOOD: { quality: 4, label: '좋음', emoji: '😊' },
  EASY: { quality: 5, label: '쉬움', emoji: '😎' }
};
```

### 4. 게임 플레이 통합

#### 4.1 스토리 모드에서 단어 수집

```typescript
// 스토리에서 나온 단어 자동 등록
function collectWordsFromStory(story: Story, turn: number): WordCard[] {
  return story.targetWords.map(word => ({
    word,
    definition: '', // LLM으로 생성
    examples: [extractExampleFromStory(story.content, word)],
    
    // SM-2 초기값
    easinessFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(), // 즉시 복습 가능
    
    // 통계
    totalReviews: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastReviewDate: new Date(),
    
    // 메타데이터
    firstSeenChapter: turn,
    genres: [story.genre],
    difficulty: 1
  }));
}
```

#### 4.2 퀴즈 결과 반영

```typescript
// 퀴즈 정답/오답 시 SM-2 업데이트
function handleQuizResult(
  word: string,
  isCorrect: boolean,
  responseTime: number,
  hintsUsed: number
) {
  const card = wordCardDB.get(word);
  const quality = mapQuizResultToQuality(isCorrect, responseTime, hintsUsed);
  
  const updatedCard = sm2.calculateNextReview(card, quality);
  wordCardDB.update(updatedCard);
  
  // 다음 복습 알림
  if (updatedCard.interval === 1) {
    showNotification(`"${word}"를 내일 다시 복습하세요!`);
  }
}
```

### 5. 복습 알림 시스템

#### 5.1 게임 시작 시 알림

```typescript
function checkDailyReview(): DailyReview {
  const dueCards = sm2.getDueCards(wordCardDB.getAll());
  
  if (dueCards.length > 0) {
    showReviewPrompt({
      message: `오늘 복습할 단어가 ${dueCards.length}개 있습니다!`,
      actions: [
        { label: '복습하기', action: () => startReviewMode() },
        { label: '나중에', action: () => {} }
      ]
    });
  }
  
  return {
    date: new Date(),
    dueCards,
    newCards: [],
    reviewedCards: [],
    stats: {
      totalDue: dueCards.length,
      completed: 0,
      accuracy: 0,
      timeSpent: 0
    }
  };
}
```

#### 5.2 복습 모드 플로우

```
[게임 시작]
    ↓
[복습 알림] → [나중에] → [스토리 모드]
    ↓ [복습하기]
[복습 화면]
    ↓
[단어 카드 표시]
    ↓
[난이도 선택] → SM-2 업데이트
    ↓
[다음 카드] (반복)
    ↓
[복습 완료 통계]
    ↓
[스토리 모드 or 종료]
```

---

## 📊 6. 학습 분석 및 통계

### 6.1 단어 마스터리 대시보드

```typescript
interface WordMasteryDashboard {
  totalWords: number;
  
  byState: {
    new: number;
    learning: number;
    review: number;
    mastered: number;
  };
  
  byDifficulty: {
    easy: number;    // EF > 2.3
    medium: number;  // 1.8 <= EF <= 2.3
    hard: number;    // EF < 1.8
  };
  
  upcomingReviews: {
    today: number;
    tomorrow: number;
    thisWeek: number;
  };
  
  streaks: {
    current: number; // 연속 복습 일수
    longest: number;
  };
}
```

### 6.2 학습 곡선 시각화

```typescript
interface LearningCurve {
  date: Date;
  newWords: number;
  reviewedWords: number;
  accuracy: number;
  averageEF: number;
}

// 차트 데이터
const chartData = learningHistory.map(day => ({
  x: day.date,
  y: day.accuracy * 100,
  label: `${day.reviewedWords} words`
}));
```

---

## 🎮 7. 게임화 요소

### 7.1 복습 보상 시스템

```typescript
interface ReviewReward {
  // 복습 완료 시 보상
  xp: number;
  items: InventoryItem[];
  achievements: Achievement[];
}

function calculateReviewReward(review: DailyReview): ReviewReward {
  const { completed, accuracy } = review.stats;
  
  return {
    xp: completed * 5 + (accuracy > 0.8 ? 50 : 0),
    items: accuracy > 0.9 ? [ITEMS.HINT] : [],
    achievements: checkReviewAchievements(review)
  };
}
```

### 7.2 복습 스트릭 (연속 일수)

```typescript
interface ReviewStreak {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date;
  
  milestones: {
    days: number;
    reward: InventoryItem;
    achieved: boolean;
  }[];
}

const STREAK_MILESTONES = [
  { days: 3, reward: ITEMS.HP_POTION },
  { days: 7, reward: ITEMS.SHIELD },
  { days: 14, reward: ITEMS.DICTIONARY },
  { days: 30, reward: ITEMS.LEGENDARY_SWORD }
];
```

### 7.3 단어 마스터 뱃지

```typescript
interface WordBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (stats: WordMasteryDashboard) => boolean;
}

const WORD_BADGES = [
  {
    id: 'beginner',
    name: '단어 초보자',
    description: '10개 단어 학습',
    icon: '🌱',
    requirement: (stats) => stats.totalWords >= 10
  },
  {
    id: 'master',
    name: '단어 마스터',
    description: '50개 단어 마스터',
    icon: '🏆',
    requirement: (stats) => stats.byState.mastered >= 50
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    description: '복습 정확도 95% 이상 (30일)',
    icon: '💎',
    requirement: (stats) => /* ... */
  }
];
```

---

## 🔧 8. 구현 세부사항

### 8.1 데이터 저장

```typescript
// LocalStorage 구조
interface WordCardDatabase {
  version: string;
  cards: { [word: string]: WordCard };
  reviewHistory: DailyReview[];
  streak: ReviewStreak;
  lastSync: Date;
}

// IndexedDB 스키마 (대용량 데이터용)
const DB_SCHEMA = {
  name: 'WordMasterDB',
  version: 1,
  stores: {
    cards: {
      keyPath: 'word',
      indexes: ['nextReviewDate', 'easinessFactor', 'repetitions']
    },
    reviews: {
      keyPath: 'date',
      indexes: ['accuracy']
    }
  }
};
```

### 8.2 복습 스케줄링

```typescript
class ReviewScheduler {
  /**
   * 오늘 복습할 단어 우선순위 정렬
   */
  prioritizeDueCards(cards: WordCard[]): WordCard[] {
    return cards.sort((a, b) => {
      // 1. 오래된 복습 우선
      const daysDiff = this.daysSince(a.nextReviewDate) - this.daysSince(b.nextReviewDate);
      if (daysDiff !== 0) return -daysDiff;
      
      // 2. 어려운 단어 우선 (낮은 EF)
      if (a.easinessFactor !== b.easinessFactor) {
        return a.easinessFactor - b.easinessFactor;
      }
      
      // 3. 틀린 횟수 많은 단어 우선
      return b.incorrectCount - a.incorrectCount;
    });
  }

  /**
   * 신규 단어 추천 (하루 최대 개수 제한)
   */
  recommendNewCards(
    allCards: WordCard[],
    maxNew: number = 5
  ): WordCard[] {
    const newCards = allCards.filter(c => c.totalReviews === 0);
    return newCards.slice(0, maxNew);
  }

  private daysSince(date: Date): number {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
```

### 8.3 LLM 통합 (단어 정의 생성)

```typescript
async function generateWordDefinition(word: string): Promise<string> {
  const prompt = `
다음 단어에 대해 초등학교 5학년 학생이 이해할 수 있도록 설명해주세요:

단어: ${word}

설명은 다음 형식으로 작성해주세요:
1. 간단한 정의 (1문장)
2. 쉬운 예시 (1-2문장)
3. 관련 단어 (2-3개)

JSON 형식으로 응답해주세요.
`;

  const response = await llm.generate(prompt);
  return response.definition;
}
```

---

## 📱 9. UI/UX 디자인

### 9.1 복습 화면 레이아웃

```
┌─────────────────────────────────────┐
│ 📚 Daily Review                     │
│ ─────────────────────────────────── │
│ Progress: ████████░░░ 15/20         │
│ Streak: 🔥 7 days                   │
├─────────────────────────────────────┤
│                                     │
│         [Front of Card]             │
│                                     │
│            추상화                    │
│                                     │
│         [Show Answer ▼]             │
│                                     │
├─────────────────────────────────────┤
│ Next review: Tomorrow               │
│ Mastery: ⭐⭐⭐☆☆                    │
└─────────────────────────────────────┘

[Answer revealed]
┌─────────────────────────────────────┐
│         [Back of Card]              │
│                                     │
│ 복잡한 것을 간단하게 만드는 것       │
│                                     │
│ 예: 철수는 추상화 검으로 몬스터의    │
│     약점을 단순하게 보았다.         │
│                                     │
├─────────────────────────────────────┤
│ How well did you know it?           │
│                                     │
│ [😫 Again] [🤔 Hard]                │
│ [😊 Good]  [😎 Easy]                │
└─────────────────────────────────────┘
```

### 9.2 단어장 화면

```
┌─────────────────────────────────────┐
│ 📖 My Word Collection               │
├─────────────────────────────────────┤
│ [All] [New] [Learning] [Mastered]  │
├─────────────────────────────────────┤
│ 🌱 추상화        Next: Today        │
│    EF: 2.1      Reps: 1             │
├─────────────────────────────────────┤
│ ⭐ 변수          Next: 3 days       │
│    EF: 2.5      Reps: 4             │
├─────────────────────────────────────┤
│ 🏆 알고리즘      Mastered!          │
│    EF: 2.8      Reps: 7             │
└─────────────────────────────────────┘
```

---

## 🎯 10. 성공 지표

### 10.1 학습 효과 측정

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 단어 정착률 | > 80% | 30일 후 재테스트 |
| 복습 참여율 | > 60% | 일일 복습 완료율 |
| 평균 EF | > 2.0 | 전체 단어 EF 평균 |
| 스트릭 유지 | > 7일 | 연속 복습 일수 |

### 10.2 게임 통합 효과

| 지표 | 목표 | 비고 |
|------|------|------|
| 복습 모드 사용률 | > 50% | 전체 플레이어 중 |
| 복습 완료 시간 | < 10분 | 일일 평균 |
| 단어 마스터 달성 | > 30개 | 플레이어당 평균 |

---

## 📋 11. 구현 우선순위

### Phase 2.1 (1-2주차)
- [x] SM-2 알고리즘 핵심 구현
- [x] WordCard 데이터 구조
- [x] 기본 복습 화면
- [x] 스토리에서 단어 수집

### Phase 2.2 (3주차)
- [ ] 복습 알림 시스템
- [ ] 단어장 화면
- [ ] 학습 통계 대시보드
- [ ] 복습 보상 시스템

### Phase 2.3 (4주차)
- [ ] 스트릭 시스템
- [ ] 뱃지 및 업적
- [ ] LLM 단어 정의 생성
- [ ] 데이터 백업/복원

---

## 🔬 12. A/B 테스트 계획

### 테스트 시나리오

**그룹 A (SM-2 적용)**:
- 복습 알림 활성화
- SM-2 기반 스케줄링
- 복습 보상 제공

**그룹 B (기본)**:
- 복습 알림 없음
- 랜덤 복습
- 보상 없음

**측정 지표**:
- 30일 후 단어 기억률
- 게임 재방문율
- 평균 플레이 시간

---

## 📚 13. 참고 자료

### SM-2 알고리즘
- [SuperMemo 2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki Manual - Deck Options](https://docs.ankiweb.net/deck-options.html)

### 구현 예시
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) - TypeScript SRS 구현
- [Anki Source Code](https://github.com/ankitects/anki)

---

**작성자**: Antigravity AI  
**검토 필요**: SM-2 파라미터 튜닝, 복습 UX 디자인
