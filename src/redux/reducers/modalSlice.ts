import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalState } from '@/redux/types'
import { RootState } from '@/redux/store'

const initialState: ModalState = {
    modalType: undefined,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalState['modalType']>) => {
            state.modalType = action.payload
        },
        closeModal: (state) => {
            state.modalType = undefined
        },
    },
})

export const {openModal, closeModal} = modalSlice.actions
export const selectModalType = (state: RootState) => state.modal.modalType
export default modalSlice.reducer