# ✨ Tactile Shockwave Halo (物理质感冲击波光晕)

> 灵感来源于推特设计师 **@Kubai087**《999 个小技巧，让你 Vibe 的产品更有质感》、**Dia** 启动光晕与 **Apple iOS** 环境跑马灯光效。

用于产品中 **AI 智能体呼出、聚焦输入框、点击触发、重大状态确认** 等高阶交互场景，提供克制、符合物理光学扩散与色彩轻微色散（RGB 通道分离）的高级微交互动效。

---

## 🌟 视觉特性

- **物理透镜扩散数学曲线**：$r(t) = r_0 + \Delta r \cdot \frac{1 - 2^{-9t}}{1 - 2^{-9}}$，前快后慢，凌厉且平滑。
- **RGB 色彩通道分离 (Chromatic Aberration)**：红通道微超前，蓝通道微滞后，产生自然色散而不模糊文字。
- **4 组经典光学调色盘**：
  - 🌌 **Aurora（极光）**：蓝 $\to$ 紫 $\to$ 粉桃
  - 🌅 **Halo（暖阳）**：琥珀 $\to$ 橙黄 $\to$ 金晨
  - 🧊 **Frost（冰霜）**：薄荷绿 $\to$ 青碧 $\to$ 冷青柠
  - ⚡ **Spark（先锋）**：深紫 $\to$ 电光紫金
- **暗色/浅色自适应**：Dark 模式采用 `screen` 混合模式加光；Light 模式采用柔和叠加染色。
- **零待机性能开销**：不触发时 Canvas 完全静止且不占用 CPU，`pointer-events: none` 不遮挡任何点击。

---

## 📂 仓库结构

```text
tactile-shockwave-halo/
├── SKILL.md                 # Antigravity / WorkBuddy / Agent Skill 规范说明
├── README.md                # 完整使用说明与技术解析
├── demo/
│   └── index.html           # 零依赖单文件即开即用交互演示
├── src/
│   ├── index.ts             # 模块导出入口
│   ├── ShockwaveHalo.tsx    # 核心物理光晕 Canvas 组件与调色盘定义
│   └── AgentShockwavePill.tsx # 弹性展开的智能体输入框与金属边框组件
└── prompts/
    └── kubai-halo-prompt.md # @Kubai087 的原始 1.3 万字完整 AI 落地提示词
```

---

## 🚀 快速使用 (React + Tailwind)

### 1. 安装组件文件
将 `src/ShockwaveHalo.tsx` 复制到您的项目组件目录中。

### 2. 在页面中挂载
```tsx
import { useRef } from 'react';
import { ShockwaveCanvas, ShockwaveHaloRef } from './components/ShockwaveHalo';

export default function MyPage() {
  const haloRef = useRef<ShockwaveHaloRef>(null);

  const handleCallAgent = (e: React.MouseEvent) => {
    // 在点击位置发射物理冲击波
    haloRef.current?.trigger({
      x: e.clientX,
      y: e.clientY,
      palette: 'aurora', // 'aurora' | 'halo' | 'frost' | 'spark'
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* 全屏物理光晕画布 */}
      <ShockwaveCanvas ref={haloRef} theme="dark" />

      {/* 业务按钮 */}
      <button
        onClick={handleCallAgent}
        className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg"
      >
        呼出智能体
      </button>
    </div>
  );
}
```

---

## 🤖 配合 AI 助手使用 (Antigravity / WorkBuddy / Cursor Skill)

本仓库根目录自带标准 `SKILL.md`：
- 若使用 **Antigravity / WorkBuddy**：将本文件夹复制到 `~/.gemini/config/skills/tactile-shockwave-halo` 或 `~/.workbuddy/skills/tactile-shockwave-halo`，即可在任何对话中输入“给我的页面加一个物理冲击波光晕”自动调用。
- 若使用 **Cursor / Claude Code**：直接将 `prompts/kubai-halo-prompt.md` 粘贴给 AI，即可全自动为您的代码库改造出同款动效。

---

## 📄 授权协议

MIT License. Designed & Curated by **hennysky** based on ideas by **@Kubai087**.
