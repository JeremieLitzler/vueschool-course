import { ref, defineComponent } from "vue";
import "./modal.css";

const Modal = defineComponent({
  setup(props, { expose }) {
    const isOpen = ref(false);
    const open = () => (isOpen.value = true);
    const close = () => (isOpen.value = false);

    expose({ open })
    
    return () => (
      <>
        <button onClick={open}>Toggle</button>
        {isOpen.value && (
          <div class="modal">
            <div class="backdrop"></div>
            <div class="modal-body">
              <p>My awesome modal content</p>
              <button onClick={close}>Close</button>
            </div>
          </div>
        )}
      </>
    );
  },
});

export default Modal;
