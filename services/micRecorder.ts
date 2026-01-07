// Handles microphone recording for Echo-Guard

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  mediaRecorder = new MediaRecorder(stream)

  audioChunks = []

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data)
  }

  mediaRecorder.start()
}

export async function stopRecording(): Promise<Blob> {
  return new Promise(resolve => {
    if (!mediaRecorder) return

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
      resolve(audioBlob)
    }

    mediaRecorder.stop()
  })
}
