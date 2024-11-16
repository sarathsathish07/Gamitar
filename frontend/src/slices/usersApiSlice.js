import { apiSlice } from "./apiSlice.js";

const USERS_URL = '/api/users'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    login: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      })
    }),
    register: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data
      })
    }),
    logout: builder.mutation({
      query: ()=>({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      })
    }),
    updateUser: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data
      })
    }),
    fetchGrid: builder.query({
      query: () => ({
        url: `${USERS_URL}/grid`,
        method: 'GET',
      }),
    }),
    updateGridCell: builder.mutation({
      query: ({ rowIndex, colIndex, unicodeChar }) => ({
        url: `${USERS_URL}/grid/update`,
        method: 'PUT',
        body: { rowIndex, colIndex, unicodeChar },
      }),
    }),
  })
})


export const { 
  useLoginMutation, 
  useLogoutMutation,
  useRegisterMutation, 
  useUpdateUserMutation,
  useFetchGridQuery, useUpdateGridCellMutation
} = usersApiSlice