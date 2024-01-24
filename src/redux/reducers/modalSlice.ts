import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalState } from '@/redux/types'
import { RootState } from '@/redux/store'

const initialState: ModalState = {
    modalType: undefined,
    data: undefined,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalState>) => {
            state.modalType = action.payload.modalType
            state.data = action.payload.data
        },
        closeModal: (state) => {
            state.modalType = undefined
            state.data = undefined
        },
    },
})

export const {openModal, closeModal} = modalSlice.actions
export const selectModalType = (state: RootState) => state.modal.modalType
export const selectModalData = (state: RootState) => state.modal.data
export default modalSlice.reducer