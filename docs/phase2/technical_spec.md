# Phase 2 기술 명세서

**작성일:** 2025-11-20  
**버전:** 2.0

---

## 1. 이미지 생성 API 명세

### 1.1 DALL-E 3 통합

#### 엔드포인트
```
POST https://api.openai.com/v1/images/generations
```

#### 요청 형식
```javascript
{
  "model": "dall-e-3",
  "prompt": "A pixel art style illustration of a hero holding a glowing sword facing a slime monster, dark dungeon background, anime style",
  "size": "1024x1024",
  "quality": "standard", // or "hd"
  "style": "vivid", // or "natural"
  "n": 1
}
```

#### 응답 형식
```javascript
{
  "created": 1234567890,
  "data": [
    {
      "url": "https://...",
      "revised_prompt": "..."
    }
  ]
}
```

#### 비용
- Standard quality: $0.040/image
- HD quality: $0.080/image

---

### 1.2 Stable Diffusion 통합 (Replicate API)

#### 엔드포인트
```
POST https://api.replicate.com/v1/predictions
```

#### 요청 형식
```javascript
{
  "version": "stability-ai/sdxl:...",
  "input": {
    "prompt": "...",
    "negative_prompt": "blurry, low quality",
    "width": 1024,
    "height": 1024,
    "num_outputs": 1,
    "scheduler": "K_EULER",
    "num_inference_steps": 50,
    "guidance_scale": 7.5
  }
}
```

#### 비용
- ~$0.0055/image (훨씬 저렴)

---

### 1.3 이미지 생성 서비스 인터페이스

```typescript
interface ImageGeneratorService {
  /**
   * 프롬프트로 이미지 생성
   * @param prompt - 이미지 설명
   * @param options - 생성 옵션
   * @returns 이미지 URL
   */
  generateImage(
    prompt: string, 
    options?: ImageGenerationOptions
  ): Promise<string>;

  /**
   * 캐시에서 이미지 조회
   * @param prompt - 이미지 설명
   * @returns 캐시된 이미지 URL 또는 null
   */
  getCachedImage(prompt: string): Promise<string | null>;

  /**
   * 이미지를 캐시에 저장
   * @param prompt - 이미지 설명
   * @param imageUrl - 이미지 URL
   */
  cacheImage(prompt: string, imageUrl: string): Promise<void>;
}

interface ImageGenerationOptions {
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}
```

---

## 2. 게임 상태 확장 명세

### 2.1 확장된 GameState 타입

```typescript
interface GameState {
  // 기존 필드
  gameState: GameStateType;
  userData: UserData;
  currentStory: Story | null;
  error: string | null;

  // 확장된 RPG 상태
  rpgState: {
    // 기존
    turn: number;
    hp: number;
    maxHp: number;
    history: string[];
    isGameOver: boolean;

    // 새로운 필드
    level: number;
    xp: number;
    xpToNextLevel: number;
    inventory: InventoryItem[];
    difficulty: DifficultyLevel;
    stats: PlayerStats;
    activeEffects: ActiveEffect[];
  };

  // 새로운 필드
  settings: GameSettings;
  achievements: Achievement[];
}
```

### 2.2 인벤토리 타입

```typescript
interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  effect: ItemEffect;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

type ItemType = 'POTION' | 'SHIELD' | 'HINT' | 'DICTIONARY' | 'SPECIAL';

interface ItemEffect {
  hp?: number;
  protection?: number;
  removeWrongAnswer?: number;
  showDefinition?: boolean;
  xpBoost?: number;
}
```

### 2.3 레벨 시스템 타입

```typescript
interface LevelSystem {
  level: number;
  xp: number;
  xpToNextLevel: number;
  benefits: LevelBenefit[];
}

interface LevelBenefit {
  level: number;
  type: 'HP_INCREASE' | 'ITEM_GRANT' | 'SKILL_UNLOCK';
  value: any;
  description: string;
}

// XP 계산 함수
function calculateXP(action: string): number {
  const XP_TABLE = {
    QUIZ_CORRECT: 10,
    CHAPTER_COMPLETE: 50,
    STREAK_BONUS: 20,
    PERFECT_CHAPTER: 100
  };
  return XP_TABLE[action] || 0;
}

// 레벨업 체크
function checkLevelUp(currentXP: number, currentLevel: number): boolean {
  const requiredXP = currentLevel * 100;
  return currentXP >= requiredXP;
}
```

---

## 3. 저장/로드 시스템 명세

### 3.1 저장 데이터 스키마

```typescript
interface SaveData {
  version: string; // "2.0"
  timestamp: number;
  slot: number; // 1, 2, 3
  
  // 게임 상태
  gameState: GameState;
  
  // 스토리 히스토리
  storyHistory: StoryHistoryEntry[];
  
  // 통계
  statistics: GameStatistics;
  
  // 설정
  settings: GameSettings;
}

interface StoryHistoryEntry {
  turn: number;
  title: string;
  content: string;
  imageUrl: string | null;
  imagePrompt: string;
  userAction: string;
  quizResult: boolean;
  timestamp: number;
}

interface GameStatistics {
  totalPlayTime: number; // 초
  chaptersCompleted: number;
  totalQuizzes: number;
  correctAnswers: number;
  itemsUsed: number;
  wordsLearned: string[];
  favoriteGenre: string;
}
```

### 3.2 저장/로드 API

```typescript
interface SaveLoadService {
  /**
   * 게임 저장
   * @param slot - 저장 슬롯 (1-3)
   * @param data - 저장할 데이터
   */
  saveGame(slot: number, data: SaveData): Promise<void>;

  /**
   * 게임 로드
   * @param slot - 로드할 슬롯 (1-3)
   * @returns 저장된 데이터
   */
  loadGame(slot: number): Promise<SaveData | null>;

  /**
   * 저장 슬롯 목록 조회
   * @returns 모든 슬롯의 메타데이터
   */
  listSaves(): Promise<SaveMetadata[]>;

  /**
   * 저장 삭제
   * @param slot - 삭제할 슬롯
   */
  deleteSave(slot: number): Promise<void>;

  /**
   * 자동 저장
   * @param data - 저장할 데이터
   */
  autoSave(data: SaveData): Promise<void>;
}

interface SaveMetadata {
  slot: number;
  timestamp: number;
  level: number;
  turn: number;
  heroName: string;
  playTime: number;
}
```

---

## 4. 이미지 캐싱 시스템 명세

### 4.1 캐시 스토리지 구조

```typescript
interface ImageCache {
  /**
   * 프롬프트 해시를 키로 사용
   */
  [promptHash: string]: CachedImage;
}

interface CachedImage {
  url: string; // Blob URL 또는 Data URL
  prompt: string;
  timestamp: number;
  expiresAt: number;
  size: number; // bytes
  format: 'png' | 'webp' | 'jpeg';
}
```

### 4.2 캐싱 전략

```typescript
class ImageCacheManager {
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일

  /**
   * 프롬프트 해시 생성
   */
  private hashPrompt(prompt: string): string {
    // SHA-256 해시 사용
    return crypto.subtle.digest('SHA-256', 
      new TextEncoder().encode(prompt)
    ).then(/* ... */);
  }

  /**
   * 캐시에서 이미지 조회
   */
  async get(prompt: string): Promise<string | null> {
    const hash = await this.hashPrompt(prompt);
    const cached = await this.storage.get(hash);
    
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      await this.delete(hash);
      return null;
    }
    
    return cached.url;
  }

  /**
   * 이미지 캐시에 저장
   */
  async set(prompt: string, imageUrl: string): Promise<void> {
    const hash = await this.hashPrompt(prompt);
    const blob = await fetch(imageUrl).then(r => r.blob());
    
    // 캐시 크기 확인 및 정리
    await this.ensureCacheSize(blob.size);
    
    const cached: CachedImage = {
      url: URL.createObjectURL(blob),
      prompt,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_EXPIRY,
      size: blob.size,
      format: this.detectFormat(blob)
    };
    
    await this.storage.set(hash, cached);
  }

  /**
   * 캐시 크기 관리 (LRU)
   */
  private async ensureCacheSize(newSize: number): Promise<void> {
    const currentSize = await this.getTotalCacheSize();
    
    if (currentSize + newSize > this.MAX_CACHE_SIZE) {
      // 가장 오래된 항목부터 삭제
      await this.evictOldest(currentSize + newSize - this.MAX_CACHE_SIZE);
    }
  }
}
```

---

## 5. 성능 최적화 명세

### 5.1 코드 스플리팅

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const InputScreen = lazy(() => import('./components/InputScreen'));
const StoryScreen = lazy(() => import('./components/StoryScreen'));
const QuizScreen = lazy(() => import('./components/QuizScreen'));
const ActionInputScreen = lazy(() => import('./components/ActionInputScreen'));
const ResultScreen = lazy(() => import('./components/ResultScreen'));

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="loading-spinner">Loading...</div>
);

// 사용
<Suspense fallback={<LoadingFallback />}>
  <StoryScreen {...props} />
</Suspense>
```

### 5.2 이미지 최적화

```typescript
interface ImageOptimizationConfig {
  // Lazy loading
  loading: 'lazy' | 'eager';
  
  // 반응형 이미지
  srcSet: string;
  sizes: string;
  
  // Progressive loading
  placeholder: 'blur' | 'empty';
  blurDataURL?: string;
  
  // 포맷
  format: 'webp' | 'png' | 'jpeg';
  quality: number; // 1-100
}

// 사용 예시
<img
  src={imageUrl}
  srcSet={`
    ${imageUrl}?w=400 400w,
    ${imageUrl}?w=800 800w,
    ${imageUrl}?w=1200 1200w
  `}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  loading="lazy"
  alt={story.title}
/>
```

### 5.3 메모이제이션

```typescript
// 컴포넌트 메모이제이션
const StoryScreen = React.memo(({ story, onNext }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.story.title === nextProps.story.title;
});

// 값 메모이제이션
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 콜백 메모이제이션
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 6. API 통합 명세

### 6.1 통합 LLM 서비스

```typescript
interface LLMService {
  /**
   * 스토리 생성
   */
  generateStory(params: StoryGenerationParams): Promise<Story>;
  
  /**
   * 이미지 프롬프트 개선
   */
  enhanceImagePrompt(prompt: string): Promise<string>;
  
  /**
   * 단어 정의 생성
   */
  getWordDefinition(word: string): Promise<string>;
}

interface StoryGenerationParams {
  heroName: string;
  targetWords: string[];
  genre: string;
  previousContext?: string;
  userAction?: string;
  difficulty?: DifficultyLevel;
}

interface Story {
  title: string;
  content: string;
  summary: string;
  image_prompt: string;
  quiz: Quiz;
  // 새로운 필드
  itemDrop?: InventoryItem;
  xpReward: number;
  difficulty: number;
}
```

### 6.2 에러 처리

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public retryable: boolean
  ) {
    super(message);
  }
}

// 재시도 로직
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1 || !error.retryable) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## 7. 테스트 명세

### 7.1 유닛 테스트

```typescript
// imageGenerator.test.ts
describe('ImageGenerator', () => {
  it('should generate image from prompt', async () => {
    const generator = new ImageGenerator('dalle');
    const url = await generator.generateImage('test prompt');
    expect(url).toMatch(/^https?:\/\//);
  });

  it('should use cached image if available', async () => {
    const generator = new ImageGenerator('dalle');
    const spy = jest.spyOn(generator, 'generateImage');
    
    await generator.getImage('test prompt');
    await generator.getImage('test prompt');
    
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

// inventory.test.ts
describe('Inventory System', () => {
  it('should add item to inventory', () => {
    const inventory = new Inventory();
    inventory.addItem(ITEMS.HP_POTION);
    expect(inventory.items).toHaveLength(1);
  });

  it('should use item and apply effect', () => {
    const inventory = new Inventory();
    const gameState = { hp: 2, maxHp: 3 };
    
    inventory.addItem(ITEMS.HP_POTION);
    inventory.useItem(ITEMS.HP_POTION.id, gameState);
    
    expect(gameState.hp).toBe(3);
  });
});
```

### 7.2 E2E 테스트

```typescript
// e2e/image-generation.spec.ts
test('should generate and display image', async ({ page }) => {
  await page.goto('/');
  
  // 게임 시작
  await fillGameStart(page);
  await page.click('button:has-text("Start Adventure")');
  
  // 스토리 로딩 대기
  await page.waitForSelector('.story-screen');
  
  // 이미지 로딩 대기
  await page.waitForSelector('img[alt*="story"]', { timeout: 30000 });
  
  // 이미지 로드 확인
  const image = await page.$('img[alt*="story"]');
  expect(await image.isVisible()).toBeTruthy();
  
  // 스크린샷
  await page.screenshot({ path: 'story-with-image.png' });
});
```

---

## 8. 보안 명세

### 8.1 API 키 관리

```typescript
// 환경 변수
VITE_OPENAI_API_KEY=sk-...
VITE_REPLICATE_API_TOKEN=r8_...

// 백엔드 프록시 (권장)
// api/generate-image
export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  // API 키는 서버 측에서만 사용
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    // ...
  });
  
  return Response.json(response);
}
```

### 8.2 입력 검증

```typescript
// 프롬프트 검증
function validatePrompt(prompt: string): boolean {
  // 길이 제한
  if (prompt.length > 1000) return false;
  
  // 금지 단어 필터링
  const bannedWords = ['...'];
  if (bannedWords.some(word => prompt.includes(word))) {
    return false;
  }
  
  return true;
}

// HTML sanitization
import DOMPurify from 'dompurify';

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'br'],
    ALLOWED_ATTR: []
  });
}
```

---

## 9. 배포 명세

### 9.1 환경 설정

```bash
# .env.production
VITE_API_URL=https://api.wordmaster.com
VITE_OPENAI_API_KEY=sk-...
VITE_ENABLE_ANALYTICS=true
VITE_CACHE_VERSION=2.0
```

### 9.2 빌드 최적화

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['framer-motion', 'lucide-react'],
          'game': ['./src/context/GameContext', './src/hooks/useGameLogic']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
}
```

---

**작성자**: Antigravity AI  
**검토 필요**: API 선택, 보안 정책, 성능 목표
