export function useModal(emit) {
    return {
        closeModal: () => {emit("close")}
    };
}