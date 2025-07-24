'use server'
import { revalidatePath } from 'next/cache'
export  async function actionRevalidatePath() {
  revalidatePath('/')
}