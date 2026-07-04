import { memo } from 'react'

export interface ConfettiPieceData {
  id: number
  color: string
  delay: number
  left: number
  rotation: number
  scale: number
}

type ConfettiPieceProps = ConfettiPieceData

export const ConfettiPiece = memo(function ConfettiPiece({
  color,
  delay,
  left,
  rotation,
  scale,
}: ConfettiPieceProps) {
  return (
    <div
      className="at-confetti-piece"
      style={{
        left: `${left}%`,
        backgroundColor: color,
        animationDelay: `${delay}ms`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    />
  )
})
