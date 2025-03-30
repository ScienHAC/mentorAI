"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
}

export default function FileUpload({ onFileSelect, accept = "*" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length) {
      handleFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)
    onFileSelect(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-300 dark:border-gray-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-emerald-500" />
          <span className="text-sm">{selectedFile.name}</span>
          <button
            type="button"
            onClick={removeFile}
            className="text-gray-500 hover:text-red-500 h-6 w-6 p-0 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Drag and drop your file here, or</p>
          <label
            htmlFor="file-upload"
            className="mt-2 inline-block cursor-pointer text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            browse to upload
          </label>
          <input id="file-upload" type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        </>
      )}
    </div>
  )
}

