export function useModal(emit) {
    return {
        closeModal: () => {console.log("closing modal"); emit("close")}
    };
}