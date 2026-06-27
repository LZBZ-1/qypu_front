import { supabase } from '@/lib/supabaseClient'

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${ext}`
    const path = `boletas/${fileName}`

    const { error } = await supabase.storage
      .from('qypu-uploads')
      .upload(path, file, { contentType: file.type })

    if (error) throw new Error('Error al subir imagen')

    const { data } = supabase.storage
      .from('qypu-uploads')
      .getPublicUrl(path)

    return data.publicUrl
  }
}