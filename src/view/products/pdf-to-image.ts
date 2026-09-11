"use client"

const PDFJS_WORKER_URL = "/pdf.worker.min.mjs"

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL
  return pdfjs
}

async function renderPageToBlob(
  file: File,
  pageNumber: number,
  scale = 2
): Promise<Blob> {
  const pdfjs = await loadPdfjs()
  const data = await file.arrayBuffer()
  const doc = await pdfjs.getDocument({ data }).promise
  const page = await doc.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement("canvas")
  canvas.width = viewport.width
  canvas.height = viewport.height

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")

  await page.render({ canvasContext: ctx, viewport }).promise

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to render PDF page"))
      },
      "image/png",
      1
    )
  })
}

export async function pdfToImageFile(file: File): Promise<File> {
  const blob = await renderPageToBlob(file, 1, 2)
  const name = file.name.replace(/\.pdf$/i, ".png")
  return new File([blob], name, { type: "image/png" })
}
