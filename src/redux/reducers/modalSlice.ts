import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalState } from '@/redux/types'
import { RootState } from '@/redux/store'
import { v4 as uuidv4 } from 'uuid'

const initialState: ModalState[] = []

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<Omit<ModalState, 'id'>>) => [{
            ...action.payload,
            id: uuidv4(),
        }, ...state] as ModalState[],
        closeModal: (state, action: PayloadAction<{
            id: string
        } | undefined>) => {
            if (action.payload?.id) {
                return state.filter(modal => modal.id !== action.payload?.id)
            }
            return state.slice(1)
        },
    },
})

export const {openModal, closeModal} = modalSlice.actions
export const selectModals = (state: RootState): ModalState[] => state.modal
export default modalSlice.reducer