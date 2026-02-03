"use client"

import { useRef, memo } from "react"
import { CloudUpload, FileText, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FieldSet } from "@/components/ui/field"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"

interface UploadZoneProps {
    selectedFiles: File[]
    onFilesChange: (files: File[]) => void
}

export const UploadZone = memo(({ selectedFiles, onFilesChange }: UploadZoneProps) => {
    const documentsInputRef = useRef<HTMLInputElement>(null)

    const triggerFileInput = () => documentsInputRef.current?.click()

    const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            onFilesChange([...selectedFiles, ...newFiles])
        }
        if (e.target) e.target.value = ""
    }

    const handleRemoveDocument = (indexToRemove: number) => {
        onFilesChange(selectedFiles.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="pt-2 border-t mt-4">
            <div className="flex items-center justify-between mb-2">
                <legend className="text-sm font-semibold text-foreground flex items-center gap-2 pt-2 w-full ">
                    <FileText className="size-4 text-blue-500" />
                    Novos Documentos (Opcional)
                </legend>
                {selectedFiles.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={triggerFileInput}
                        className="h-8 text-xs cursor-pointer"
                    >
                        <Paperclip className="w-3 h-3 mr-2" />
                        Adicionar
                    </Button>
                )}
            </div>

            <input
                type="file"
                ref={documentsInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleDocumentsSelect}
            />

            <FieldSet>
                {selectedFiles.length === 0 ? (
                    <Empty
                        className="border border-dashed py-6 mt-1 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={triggerFileInput}
                    >
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudUpload className="h-8 w-8 text-muted-foreground/60" />
                            </EmptyMedia>
                            <EmptyTitle className="text-base font-medium text-foreground text-center">
                                Sem novos documentos
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-center">
                                Clique para selecionar novos arquivos para o prontuário
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                className="cursor-pointer"
                            >
                                Selecionar Arquivos
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <div className="space-y-2 border rounded-md p-2 mt-1 max-h-40 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between p-2 bg-muted/40 rounded-md border text-sm animate-in fade-in slide-in-from-bottom-1"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded bg-background flex items-center justify-center border shrink-0 text-blue-500">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 cursor-pointer"
                                    onClick={() => handleRemoveDocument(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
})

UploadZone.displayName = "UploadZone"