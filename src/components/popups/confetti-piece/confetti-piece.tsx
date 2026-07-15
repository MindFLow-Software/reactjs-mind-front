import { memo } from 'react'

import './confetti-piece.css'

export type IConfettiPieceData = {
  id: number
  color: string
  delay: number
  left: number
  rotation: number
  scale: number
}

type IConfettiPiece = {
  piece: IConfettiPieceData
}

export const ConfettiPiece = memo(function ConfettiPiece({
  piece,
}: IConfettiPiece) {
  return (
    <div
      className="at-confetti-piece"
      style={{
        left: `${piece.left}%`,
        backgroundColor: piece.color,
        animationDelay: `${piece.delay}ms`,
        transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
      }}
    />
  )
})
