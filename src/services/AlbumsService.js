import { nanoid } from 'nanoid'
import InvariantError from '../exceptions/InvariantError.js'
import { mapDBToModel } from '../utils/index.js'
import NotFoundError from '../exceptions/NotFoundError.js'
import pg from 'pg'

export default class AlbumsService {
    constructor () {
        this._pool = new pg.Pool()
    }

    async getAlbumById (id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan!')
        }
        return result.rows.map(mapDBToModel)[0]
    }

    async getSongsByAlbum (albumId) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [albumId]
        }
        const result = await this._pool.query(query)

        return result.rows
    }

    async editAlbumById (id, { name, year }) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id=$4 RETURNING *',
            values: [name, year, updatedAt, id]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal memperbarui album. Id tidak ditemukan')
        }

        // return result.rows[0];
        return result.rows.map(mapDBToModel)[0]
    }

    async deleteAlbumById (id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal menghapus album. Id tidak ditemukan')
        }
    }

    async addAlbum ({ name, year }) {
        const id = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: `INSERT INTO albums 
                VALUES($1, $2, $3, $4, $5) RETURNING id`,
            values: [id, name, year, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan')
        }

        return result.rows[0].id
    }
}
