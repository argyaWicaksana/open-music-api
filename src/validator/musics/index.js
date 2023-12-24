import InvariantError from '../../exceptions/InvariantError.js'
import { AlbumPayloadSchema, SongPayloadSchema } from './schema.js'

export default {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}
