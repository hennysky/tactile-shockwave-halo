---
name: tactile-shockwave-halo
description: 为 Web / React / 全栈应用添加高质感物理冲击波（含透镜空间扭曲、RGB 通道轻微色散、多色环与边线反光）与金属边缘弹性输入框动效。当用户需要实现“AI 智能体呼出动效”、“物理质感光环冲击波”、“高质感按钮微交互”、“全屏跑马灯光晕”、“Tactile Shockwave Halo”或类似 Dia/Apple iOS 先锋交互时，必须激活此技能。
metadata:
  version: "1.0.0"
  author: "hennysky"
  inspiration: "@Kubai087 / Dia / Apple iOS"
---

# Tactile Shockwave Halo (物理质感冲击波光晕)

为产品交互（尤其是 **AI 智能体呼出、聚焦输入框、提交命令、重大操作反馈**）提供一种克制而具有真实物理光学质感的冲击波动效。

灵感来源于 Apple iOS 跑马灯光晕与 Dia 首页启动时光环冲击波的结合。

---

## 🌟 核心视觉物理层级 (6 Optical Layers)

```
[Layer 1: 页面快照] ──> [Layer 2: 透镜空间扭曲] ──> [Layer 3: RGB通道分离 (±8%色散)]
                            │
[Layer 6: 边线反光] <── [Layer 5: 玻璃边缘折射] <── [Layer 4: 四色环平滑渲染]
```

1. **页面快照 (Page Snapshot)**：将当前视口内容捕获为图像底图，作为后续扭曲与像素偏移的计算基准。
2. **透镜空间扭曲 (Lens Bend)**：冲击波作为一个连续的凸透镜模型，外侧轻微拉伸、内侧压缩，表现空间被能量推开。
3. **RGB 通道分离 (Chromatic Aberration)**：红通道偏移 $+8\%$，蓝通道偏移 $-8\%$，在位移波峰处形成极其克制的轻微色散，同时文字保持完全可读。
4. **四色环 (Color Rings)**：四道宽色环平滑高斯过渡。浅色模式为微染色，深色模式采用 `screen`（滤色加光）模式。
5. **玻璃边缘折射 (Glass Bevel)**：波浪到达视口边缘时，边缘 $60\text{px}$ 如同透过斜边玻璃向外拉伸，窗口外框保持固定。
6. **边线短暂反光 (Glints on Borders)**：冲击波经过时，页面原有的分割线、卡片边框短暂高亮提亮。

---

## 📐 精确数学与物理公式

### 1. 扩散半径时间曲线 (Fast-to-Slow Expansion)
持续时间一般为 $1000\text{ms}$，归一化时间 $t \in [0, 1]$：
$$r(t) = r_{start} + \Delta r \cdot \frac{1 - 2^{-9t}}{1 - 2^{-9}}$$
* 特性：前 $10\%$ 时间内跨越近一半距离，极其凌厉，而在接近屏幕边缘时平滑渐缓。

### 2. 衰减强度公式 (Fade-out Strength)
$$S(t) = \min(1, \frac{t}{0.03}) \cdot (1 - t^{2.2})$$
* 特性：前 $30\text{ms}$ 极速达到峰值 $1.0$，随后呈幂次曲线平滑消散归零。

### 3. 透镜推力与色散公式 (Lens Push & Chromatic Split)
设环宽 $w = 110\text{px}$，局部归一化坐标 $z = \frac{d - r(t)}{w} \cdot 0.75$：
$$\text{push}(z) = 7\text{px} \cdot 2.33 \cdot z \cdot e^{-z^2}$$
* 红色通道偏移：$\text{push} \times 1.08$
* 绿色通道基准：$\text{push} \times 1.00$
* 蓝色通道偏移：$\text{push} \times 0.92$

---

## 🎨 4 组经典光学配色 (Palettes)

| 方案 | 中文名 | Dark 模式色值 (内到外) | Light 模式色值 (内到外) |
| :--- | :--- | :--- | :--- |
| **Aurora** | 极光蓝紫粉桃 | `rgb(80,140,255)`, `rgb(160,110,255)`, `rgb(255,110,180)`, `rgb(255,190,140)` | `rgb(110,150,255)`, `rgb(180,130,255)`, `rgb(255,130,190)`, `rgb(255,180,120)` |
| **Halo** | 暖阳晨光金晕 | `rgb(255,150,60)`, `rgb(255,190,70)`, `rgb(255,225,120)`, `rgb(255,245,210)` | `rgb(255,140,50)`, `rgb(255,175,60)`, `rgb(245,200,80)`, `rgb(255,225,150)` |
| **Frost** | 清透薄荷青绿 | `rgb(80,220,175)`, `rgb(70,195,225)`, `rgb(180,240,150)`, `rgb(235,255,245)` | `rgb(40,190,150)`, `rgb(50,170,210)`, `rgb(140,210,90)`, `rgb(180,235,215)` |
| **Spark** | 先锋紫金电光 | `rgb(140,100,255)`, `rgb(200,130,255)`, `rgb(255,200,110)`, `rgb(255,235,170)` | `rgb(130,95,240)`, `rgb(185,125,245)`, `rgb(245,185,80)`, `rgb(250,215,120)` |

---

## 💻 快速接入指南 (React / Tailwind)

### 1. 引入组件
```tsx
import { useRef } from 'react';
import { ShockwaveCanvas, ShockwaveHaloRef } from './components/ShockwaveHalo';

export default function MyPage() {
  const haloRef = useRef<ShockwaveHaloRef>(null);

  const handleTrigger = (e: React.MouseEvent) => {
    // 从点击坐标向外激发冲击波
    haloRef.current?.trigger({
      x: e.clientX,
      y: e.clientY,
      palette: 'aurora' // 'aurora' | 'halo' | 'frost' | 'spark'
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* 全屏物理光晕画布 (pointer-events-none，平时不占用算力) */}
      <ShockwaveCanvas ref={haloRef} theme="dark" />

      {/* 触发按钮 */}
      <button onClick={handleTrigger} className="px-5 py-2.5 rounded-full bg-blue-600 text-white">
        呼出智能体
      </button>
    </div>
  );
}
```

---

## 📜 许可证与致谢

* **致谢**：视觉创意来源于推特博主 `@Kubai087` 的《999 个小技巧》栏目与 Dia 团队。
* **协议**：MIT License，允许在个人与商业项目中自由复用。
