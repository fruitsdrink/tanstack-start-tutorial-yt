/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/**
 * 主题提供者组件
 *
 * 功能：管理应用的暗色/亮色主题切换
 * 支持三种模式：
 * - 'dark': 强制暗色主题
 * - 'light': 强制亮色主题
 * - 'system': 跟随系统偏好设置
 *
 * 特性：
 * - 使用 localStorage 持久化用户选择
 * - 自动监听系统偏好变化
 * - 防止 FOUC (Flash of Unstyled Content)
 * - 支持 SSR (服务端渲染)
 *
 * 参考实现：
 * - https://ui.shadcn.com/docs/dark-mode/vite
 * - https://github.com/pacocoursey/next-themes
 */
import { ScriptOnce } from '@tanstack/react-router'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

// 主题类型：支持暗色、亮色和系统模式
type Theme = 'dark' | 'light' | 'system'

// 媒体查询：用于检测系统是否偏好暗色主题
const MEDIA = '(prefers-color-scheme: dark)'

// ThemeProvider 组件的属性类型
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme // 默认主题，默认为 'system'
  storageKey?: string // localStorage 的键名，默认为 'theme'
}

// Context 提供的状态类型
type ThemeProviderState = {
  theme: Theme // 当前主题
  setTheme: (theme: Theme) => void // 设置主题的函数
}

// Context 的初始状态
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

// 创建主题 Context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  /**
   * 主题状态管理
   *
   * 初始化逻辑：
   * 1. 检查是否在浏览器环境（支持 SSR）
   * 2. 从 localStorage 读取之前保存的主题
   * 3. 如果没有保存的值，使用 defaultTheme（默认为 'system'）
   */
  const [theme, setTheme] = useState<Theme>(
    () =>
      (typeof window !== 'undefined'
        ? (localStorage.getItem(storageKey) as Theme)
        : null) || defaultTheme,
  )

  /**
   * 处理系统偏好变化
   *
   * 功能：
   * - 仅在 theme === 'system' 时响应系统偏好变化
   * - 根据系统偏好自动切换 dark/light 类名
   * - 避免重复添加已存在的类名
   */
  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      // 如果用户手动设置了主题，不响应系统变化
      if (theme !== 'system') return
      const root = window.document.documentElement
      // 根据系统偏好确定目标主题
      const targetTheme = e.matches ? 'dark' : 'light'
      // 只在类名不存在时才更新，避免不必要的 DOM 操作
      if (!root.classList.contains(targetTheme)) {
        root.classList.remove('light', 'dark')
        root.classList.add(targetTheme)
      }
    },
    [theme],
  )

  /**
   * 监听系统偏好变化
   *
   * 当系统颜色方案改变时（例如从亮色切换到暗色），
   * 如果当前主题是 'system'，则自动更新应用主题
   */
  useEffect(() => {
    const media = window.matchMedia(MEDIA)

    // 添加监听器
    media.addEventListener('change', handleMediaQuery)
    // 立即执行一次，确保初始状态正确
    handleMediaQuery(media)

    // 清理：移除监听器
    return () => media.removeEventListener('change', handleMediaQuery)
  }, [handleMediaQuery])

  /**
   * 应用主题到 DOM
   *
   * 当 theme 状态变化时：
   * 1. 如果 theme === 'system':
   *    - 移除 localStorage 中的保存值（使用系统偏好）
   *    - 根据系统偏好确定目标主题
   * 2. 如果 theme === 'dark' 或 'light':
   *    - 保存到 localStorage 持久化
   *    - 直接使用该主题
   *
   * 最后更新 <html> 元素的类名，CSS 会根据类名应用对应样式
   */
  useEffect(() => {
    const root = window.document.documentElement

    let targetTheme: string

    if (theme === 'system') {
      // 系统模式：不保存到 localStorage，使用系统偏好
      localStorage.removeItem(storageKey)
      targetTheme = window.matchMedia(MEDIA).matches ? 'dark' : 'light'
    } else {
      // 手动模式：保存用户选择到 localStorage
      localStorage.setItem(storageKey, theme)
      targetTheme = theme
    }

    // 只在目标主题未应用时才更新，避免不必要的 DOM 操作
    if (!root.classList.contains(targetTheme)) {
      root.classList.remove('light', 'dark')
      root.classList.add(targetTheme)
    }
  }, [theme, storageKey])

  /**
   * Context 值
   * 使用 useMemo 优化，只在 theme 变化时重新创建
   */
  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  )

  return (
    <ThemeProviderContext {...props} value={value}>
      {/* 
        防止 FOUC (Flash of Unstyled Content)
        
        ScriptOnce 会在 HTML 解析时立即执行，在 React 渲染之前应用主题。
        这样可以避免页面加载时出现主题闪烁。
        
        逻辑：
        1. 如果 localStorage.theme === 'dark'，应用暗色主题
        2. 如果 localStorage 中没有 theme，且系统偏好暗色，应用暗色主题
        3. 否则应用亮色主题
      */}
      <ScriptOnce>
        {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
      </ScriptOnce>
      {children}
    </ThemeProviderContext>
  )
}

/**
 * 使用主题的 Hook
 *
 * 功能：
 * - 获取当前主题状态
 * - 获取设置主题的函数
 *
 * 使用示例：
 * ```tsx
 * const { theme, setTheme } = useTheme()
 *
 * // 切换到暗色主题
 * setTheme('dark')
 *
 * // 切换到亮色主题
 * setTheme('light')
 *
 * // 跟随系统偏好
 * setTheme('system')
 * ```
 *
 * 注意：必须在 ThemeProvider 内部使用，否则会抛出错误
 */
export const useTheme = () => {
  const context = use(ThemeProviderContext)

  // 错误检查：确保在 Provider 内使用
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
