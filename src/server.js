import Hapi from '@hapi/hapi'
import musics from './api/musics/index.js'
import AlbumsService from './services/AlbumsService.js'
import SongsService from './services/SongsService.js'
import MusicsValidator from './validator/musics/index.js'
import dotenv from 'dotenv'
import ClientError from './exceptions/ClientError.js'

dotenv.config()

const init = async () => {
    const albumsService = new AlbumsService()
    const songsService = new SongsService()
    const services = {
        album: albumsService,
        song: songsService
    }

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register({
        plugin: musics,
        options: {
            services,
            validator: MusicsValidator
        }
    })

    server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
        const { response } = request

        if (response instanceof Error) {
            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                })
                newResponse.code(response.statusCode)
                return newResponse
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami'
            })
            newResponse.code(500)
            return newResponse
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue
    })

    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

init()
