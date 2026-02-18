'use client'
import { getProgressColor } from '@/lib/constants'

/**
 * Visual progress bar with color-coded fill.
 * @param {Object} props
 * @param {number} props.value - Completion percentage (0-100)
 * @param {number} [props.height=4] - Bar height in pixels
 */
export default function ProgressBar({ value, height = 4 }) {
  return (
    <div style={{ width: '100%', height, background: '#1e293b', borderRadius: 99 }}>
      <div style={{
        width: `${value}%`,
        height,
        background: getProgressColor(value),
        borderRadius: 99,
        transition: 'width 0.3s'
      }} />
    </div>
  )
}
