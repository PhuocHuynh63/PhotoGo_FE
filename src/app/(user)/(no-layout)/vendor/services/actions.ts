'use server'

import { revalidatePath } from "next/cache"

export async function refreshVendorData() {
    revalidatePath('/vendor/services')
} 