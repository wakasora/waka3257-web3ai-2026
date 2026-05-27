# 滞在地図 — v1 プロトタイプ

> 街は目的を要請してくる。でも、私たちはただ滞在したいだけだ。

---

## プロダクト名

**滞在地図**（Taizai Chizu）

---

## 解決したいバグ

家の外で、生活圏の中にゆっくりできる場所が少ない。

---

## 対象ユーザー

- 街中で少し作業・休憩・待機したいが、お金を使わず・人目を気にせず居たい人
- 空き時間をスマホではなく、読書や軽作業・ぼーっとすることに使いたい人
- 「居場所」を選ぶコストを下げたい人

---

## コンセプト

Google Maps のように「どこに何があるか」を探すのではなく、「そこにどのように居られるか」を扱う地図。  
場所の種別・評判ではなく、**消費圧・目的要求度・人目圧・滞在許容時間** などの指標で滞在体験を記録・可視化する。

---

## v1 で動く機能

- `/` — トップページ（コンセプト・評価軸の説明）
- `/map` — 津田沼駅周辺の簡易マップ（CSS自作）＋フィルター＋スポットカード一覧
- `/spots/[id]` — スポット詳細（スコア・批評文・滞在ログ一覧・投稿フォーム）
- `/my-map` — localStorage に保存した自分の滞在ログ一覧
- `/area` — 津田沼のマクロな街スコア（無料滞在・作業・休憩・雨の日・消費圧など）

---

## 使用技術

| 技術 | 用途 |
|---|---|
| Next.js 15 (App Router) | フロントエンド |
| TypeScript | 型安全性 |
| Tailwind CSS v4 | スタイリング |
| localStorage | 滞在ログの永続化 |
| Google Maps API | **v1では不使用**（CSS自作マップ） |
| Supabase | **v1では不使用**（スキーマのみ定義） |

---

## 起動方法

```bash
cd lectures/week5
npm install
npm run dev
# → http://localhost:3000
```

---

## ファイル構成

```
lectures/week5/
├── app/
│   ├── page.tsx              # トップページ
│   ├── map/page.tsx          # マップページ
│   ├── spots/[id]/page.tsx   # スポット詳細
│   ├── my-map/page.tsx       # マイマップ
│   └── area/page.tsx         # 街スコア
├── components/
│   ├── Header.tsx            # ヘッダーナビ
│   ├── ScoreBar.tsx          # スコアバー
│   ├── SpotCard.tsx          # スポットカード
│   ├── MapMock.tsx           # CSS自作マップ
│   ├── FilterPanel.tsx       # フィルターUI
│   ├── StayLogForm.tsx       # 滞在ログ投稿フォーム
│   ├── StayLogList.tsx       # 滞在ログ一覧
│   └── AreaScoreCard.tsx     # 街スコアカード
└── lib/
    ├── types.ts              # 型定義
    ├── seed.ts               # 津田沼スポットデータ
    ├── scoring.ts            # スコア計算ロジック
    └── storage.ts            # localStorage操作
```

---

## seed data の増やし方

`lib/seed.ts` の `SEED_SPOTS` 配列に追加するだけ。

```ts
{
  id: 'spot-7',           // 一意なID
  name: '新しいスポット名',
  category: 'カフェ',     // 図書館/商業施設/イートイン/公園/公共施設/カフェ/その他
  area: '津田沼周辺',
  indoor: true,
  price: '低価格',         // 無料/低価格/有料
  stayDuration: '30〜60分',
  description: '...',
  baseScores: {
    consumptionPressure: 3,
    workTolerance: 3,
    purposePressure: 2,
    visibilityPressure: 2,
    stayTolerance: 4,
    weatherResistance: 5,
    fragility: 2,
  },
  mapX: 55,  // マップ上の横位置 (0-100%)
  mapY: 50,  // マップ上の縦位置 (0-100%)
},
```

---

## スコア計算の変え方

`lib/scoring.ts` を編集する。

- **ログの重みづけ**：`getWeights()` 関数でログ件数ごとの `base/log` 比率を変更
- **総合スコア式**：`calcOverallScore()` の `positive/negative` の組み合わせを変更
- **信頼度の閾値**：`getReliability()` の条件数値を変更

---

## 今後やりたいこと

- **Google Places API 連携** — 実在スポットのデータ取得・定期更新
- **Supabase 導入** — ログの永続化・共有・集計
- **公開範囲の実装** — `private / friends / area_only / public` の共有設計
- **匿名化された街スコア** — 個人ログを集約した集合知マップ
- **穴場を壊さない共有設計** — 公開範囲・エリアぼかし・閾値制御

---

## Supabase スキーマ（将来拡張用）

```sql
-- スポットマスタ
create table spots (
  id          text primary key,
  name        text not null,
  category    text not null,
  area        text not null,
  indoor      boolean not null,
  price       text not null,
  stay_duration text,
  description text,
  base_scores jsonb not null,
  map_x       float,
  map_y       float,
  created_at  timestamptz default now()
);

-- 滞在ログ
create table stay_logs (
  id                    text primary key,
  spot_id               text references spots(id),
  user_id               uuid references auth.users(id), -- 将来：認証ユーザー
  created_at            timestamptz default now(),
  activity              text not null,
  duration              text not null,
  spent_amount          text not null,
  can_open_pc           boolean,
  comfort               int check (comfort between 1 and 5),
  consumption_pressure  int check (consumption_pressure between 1 and 5),
  work_tolerance        int check (work_tolerance between 1 and 5),
  visibility_pressure   int check (visibility_pressure between 1 and 5),
  weather_escape        boolean,
  want_to_return        boolean,
  scope                 text check (scope in ('private','friends','area_only','public')),
  memo                  text
);

-- RLS: scopeに応じた読み取り制御
alter table stay_logs enable row level security;
-- private: 本人のみ
-- friends: フレンド関係のユーザー
-- area_only: エリアスコア集計にのみ使用（個人特定不可）
-- public: 全員閲覧可
```

---

## Discord 提出用 3行文

```
「滞在地図」は、街の中で"ただ居る"ことができる場所を記録・可視化するWebアプリです。
消費圧・人目圧・目的要求度など7つの軸でスポットをスコアリングし、津田沼駅周辺の seed data で動くプロトタイプを実装しました。
localStorageで滞在ログを投稿・即時反映でき、自分だけのマップと街スコアページを持ちます。
```
