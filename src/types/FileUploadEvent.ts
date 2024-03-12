import HTMLFileInputElement from '@/types/HTMLFileInputElement';

export default interface FileUploadEvent extends Event {
  target: HTMLFileInputElement;
}
