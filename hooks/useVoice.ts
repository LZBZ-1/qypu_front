'use client'

import { useState, useRef } from 'react'

export function useVoice(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    chunks.current = []

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data)
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')

      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
        const { text } = await res.json()
        onTranscript(text)
      } catch {
        console.error('Error al transcribir audio')
      }

      stream.getTracks().forEach(t => t.stop())
    }

    mediaRecorder.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    setIsRecording(false)
  }

  return { isRecording, startRecording, stopRecording }
}