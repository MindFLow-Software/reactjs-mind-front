import { api } from "@/lib/axios"

interface CreateSuggestionRequest {
  title: string
  description: string
  category: string
  files?: File[]
}

export async function createSuggestion({
  title,
  description,
  category,
  files,
}: CreateSuggestionRequest) {
  const formData = new FormData()

  formData.append("title", title)
  formData.append("description", description)
  formData.append("category", category)

  if (files) {
    files.forEach((file) => {
      formData.append("files", file)
    })
  }

  await api.post("/suggestions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}