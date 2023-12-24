/* eslint-disable camelcase */
const mapDBToModel = (obj) => {
    obj.createdAt = obj.created_at
    obj.updatedAt = obj.updated_at

    delete obj.created_at
    delete obj.updated_at

    return obj
}

export { mapDBToModel }
