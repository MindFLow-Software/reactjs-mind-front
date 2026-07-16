'use client'

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Users,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import './control-bar.css'

export type ControlBarStatus = {
  isMicMuted: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  participantCount: number
}

export type ControlBarActions = {
  onToggleMic: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onLeave: () => void
}

type ControlBarProps = {
  status: ControlBarStatus
  actions: ControlBarActions
}

export function ControlBar({ status, actions }: ControlBarProps) {
  const { isMicMuted, isVideoEnabled, isScreenSharing, participantCount } =
    status
  const { onToggleMic, onToggleVideo, onToggleScreenShare, onLeave } = actions
  return (
    <TooltipProvider>
      <div className="vr-control-bar">
        <div className="flex items-center gap-3">
          <div className="vr-control-bar-session-label">
            <div className="vr-control-bar-session-dot" />
            <span className="vr-control-bar-session-name">Sessão #123</span>
          </div>
          <Badge variant="outline" className="bg-slate-50">
            <Users className="h-3 w-3 mr-1" />
            <span className="text-xs">
              {participantCount} participante{participantCount !== 1 ? 's' : ''}
            </span>
          </Badge>
        </div>

        <div className="vr-control-bar-group">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMicMuted ? 'destructive' : 'secondary'}
                size="icon"
                onClick={onToggleMic}
                className={isMicMuted ? '' : 'hover:bg-slate-100'}
              >
                {isMicMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isMicMuted ? 'Ativar microfone' : 'Desativar microfone'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isVideoEnabled ? 'secondary' : 'destructive'}
                size="icon"
                onClick={onToggleVideo}
                className={isVideoEnabled ? 'hover:bg-slate-100' : ''}
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVideoEnabled ? 'Desativar câmera' : 'Ativar câmera'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="sm"
                onClick={onToggleScreenShare}
                className={
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline text-xs">
                  {isScreenSharing ? 'Parar' : 'Compartilhar'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isScreenSharing ? 'Parar compartilhamento' : 'Compartilhar tela'}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={onLeave}
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Sair</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Encerrar chamada</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
