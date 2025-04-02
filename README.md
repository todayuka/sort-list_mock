## 使用技術

### 言語/フレームワーク

- React
  選定理由：コンポーネントベースの開発が可能で、再利用性が高く、モダンなフロントエンド開発に適しているため。
- TypeScript
  選定理由：型定義により事前にエラーを発見でき、より堅牢で保守性の高いアプリケーションを構築できるため。

### リンター

- ES リント
  選定理由：コード品質を向上させ、潜在的なバグを防ぎ、モダンな JavaScript/TypeScript のベストプラクティスを学ぶため。

### 開発サーバー

- Vite
  選定理由：高速なビルドと開発環境を提供し、モダンなフロントエンド開発に適しているため。

### ライブラリ

- TailwindCSS
  選定理由：ユーティリティファーストの CSS フレームワークで、スタイリングが効率的に行えるため。
- shadcn/ui
  選定理由：UI コンポーネントの構築を簡素化し、デザインの一貫性を保つため。

###　ディレクトリ構成

- features ディレクトリ
  選定理由：機能ごとにディレクトリを分けることで、コードの可読性と保守性を向上させるため。

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
