"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface FileUploaderProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export function FileUploader({ files, setFiles }: FileUploaderProps) {
  const [fileErrors, setFileErrors] = useState<string[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles])
      setFileErrors([])
    },
    [setFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10485760, // 10MB
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles.map((file) => `${file.file.name} - ${file.errors[0].message}`)
      setFileErrors(errors)
    },
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <>
              <p className="text-sm font-medium">Arraste e solte arquivos aqui ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground">Suporta qualquer tipo de arquivo até 10MB</p>
            </>
          )}
        </div>
      </div>

      {fileErrors.length > 0 && (
        <div className="text-sm text-red-500 mt-2">
          {fileErrors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Arquivos anexados:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px] md:max-w-[400px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

