export default class MusicsHandler {
    constructor (services, validator) {
        this._services = services
        this._validator = validator
    }

    async postAlbumHandler (request, h) {
        this._validator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload

        const albumId = await this._services.album.addAlbum({ name, year })

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan!',
            data: {
                albumId
            }
        })

        response.code(201)
        return response
    }

    async getAlbumByIdHandler (request, h) {
        const { id } = request.params

        const album = await this._services.album.getAlbumById(id)
        const songs = await this._services.album.getSongsByAlbum(id)

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                album: {
                    ...album,
                    songs
                }
            }
        })

        return response
    }

    async putAlbumByIdHandler (request, h) {
        this._validator.validateAlbumPayload(request.payload)
        const { id } = request.params
        const { name, year } = request.payload

        const album = await this._services.album.editAlbumById(id, {
            name,
            year
        })

        return {
            status: 'success',
            message: 'Album berhasil diperbarui!',
            data: {
                album
            }
        }
    }

    async deleteAlbumByIdHandler (request, h) {
        const { id } = request.params
        await this._services.album.deleteAlbumById(id)

        return {
            status: 'success',
            message: 'Album berhasil dihapus!'
        }
    }

    async postSongHandler (request, h) {
        this._validator.validateSongPayload(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload

        const songId = await this._services.song.addSong({ title, year, genre, performer, duration, albumId })

        const response = h.response({
            status: 'success',
            message: 'Musik berhasil ditambahkan!',
            data: {
                songId
            }
        })

        response.code(201)
        return response
    }

    async getSongsHandler (request, h) {
        const title = request.query.title ?? ''
        const performer = request.query.performer ?? ''

        return h.response({
            status: 'success',
            data: {
                songs: await this._services.song.getSongs({ title, performer })
            }
        })
    }

    async getSongByIdHandler (request, h) {
        const { id } = request.params

        const song = await this._services.song.getSongById(id)

        const response = h.response({
            status: 'success',
            message: 'Musik berhasil ditampilkan',
            data: {
                song
            }
        })

        return response
    }

    async putSongByIdHandler (request, h) {
        this._validator.validateSongPayload(request.payload)
        const { id } = request.params
        const { title, year, genre, performer, duration, albumId } = request.payload

        const song = await this._services.song.editSongById(id, {
            title,
            year,
            genre,
            performer,
            duration,
            albumId
        })

        return {
            status: 'success',
            message: 'Musik berhasil diperbarui!',
            data: {
                song
            }
        }
    }

    async deleteSongByIdHandler (request, h) {
        const { id } = request.params
        await this._services.song.deleteSongById(id)

        return {
            status: 'success',
            message: 'Musik berhasil dihapus!'
        }
    }
}
