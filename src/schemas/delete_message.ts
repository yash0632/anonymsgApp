import z from 'zod'
import mongoose from 'mongoose'

const deleteMessageSchema = z.object({
    MessageId:z.string({message:"Input Validation Error"})
})

export default deleteMessageSchema