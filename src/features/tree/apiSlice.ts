import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface Entity {
    id: number;
}

export const entityApi = createApi({
    reducerPath: 'entityApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9090/'}),
    endpoints: (builder) => ({
        getEntityById: builder.query<Entity, string>({
            query: (id) => `entity/${id}`,
        }),
        getEntities: builder.query <Entity[], unknown>({
            query: () => `entity/`
        })
    }),
})

export const {useGetEntityByIdQuery, useGetEntitiesQuery} = entityApi