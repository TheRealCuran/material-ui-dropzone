import {
  AlertColor,
  ChipProps,
  DialogProps,
  GridProps,
  SnackbarProps,
} from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import { DropEvent, DropzoneProps } from 'react-dropzone'

export type FileObject = {
  readonly file: File
  readonly data: string | null
}

export type FileData = File | string

export type PreviewGridProps = {
  /**
   * Props to pass to the Material-UI Grid component (container).
   *
   * @see See [Material-UI Chip](https://material-ui.com/api/grid/#props) for available values.
   */
  container?: GridProps
  /**
   * Props to pass to the Material-UI Grid component (items).
   *
   * @see See [Material-UI Chip](https://material-ui.com/api/grid/#props) for available values.
   */
  item?: GridProps
}

export interface DropzoneAreaBaseProps {
  /** A list of file types to accept.
   *
   * @see See [here](https://react-dropzone.js.org/#section-accepting-specific-file-types) for more details.
   */
  acceptedFiles: string[]
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit?: number
  /** Icon to be displayed inside the dropzone area. */
  Icon?: SvgIconComponent
  /** Maximum file size (in bytes) that the dropzone will accept. */
  maxFileSize?: number
  /** Text inside the dropzone. */
  dropzoneText?: string
  /** Disable feedback effect when dropping rejected files. */
  disableRejectionFeedback?: boolean
  /** Shows previews **BELOW** the dropzone. */
  showPreviews?: boolean
  /** Shows preview **INSIDE** the dropzone area. */
  showPreviewsInDropzone?: boolean
  /** Shows file name under the dropzone image. */
  showFileNames?: boolean
  /** Shows file name under the image. */
  showFileNamesInPreview?: boolean
  /** Uses deletable Material-UI Chip components to display file names. */
  useChipsForPreview?: boolean
  /**
   * Props to pass to the Material-UI Chip components.
   *
   * Requires `useChipsForPreview` prop to be `true`.
   *
   * @see See [Material-UI Chip](https://material-ui.com/api/chip/#props) for available values.
   */
  previewChipProps?: ChipProps
  /**
   * Props to pass to the Material-UI Grid components.
   *
   * Should be in the form {container: GridProps, item: GridProps}.
   *
   * @see See [Material-UI Chip](https://material-ui.com/api/grid/#props) for available values.
   */
  previewGridProps?: PreviewGridProps
  /** The label for the file preview section. */
  previewText?: string
  // documentation says "reset" exists, automatically generated type doesn't
  // have it
  /**
   * The node of button to clear dropzone.
   *
   * - can be a node to mount in a placeholder.
   * - can be an object:
   *  - text (string) - text of the button
   *  - onClick (function) - callback fired when reset button clicked
   */
  reset?:
    | JSX.Element
    | {
        text?: string
        onClick(event: React.MouseEvent<HTMLButtonElement>): void
      }
  /**
   * Shows styled Material-UI Snackbar when files are dropped, deleted or rejected.
   *
   * - can be a boolean ("global" `true` or `false` for all alerts).
   * - can be an array, with values 'error', 'info', 'success' to select to view only certain alerts:
   *  - showAlerts={['error']} for only errors.
   *  - showAlerts={['error', 'info']} for both errors and info.
   *  - showAlerts={['error', 'success', 'info']} is same as showAlerts={true}.
   *  - showAlerts={[]} is same as showAlerts={false}.
   */
  showAlerts?: boolean | AlertColor[]
  /**
   * Props to pass to the Material-UI Snackbar components.<br/>Requires `showAlerts` prop to be `true`.
   *
   * @see See [Material-UI Snackbar](https://material-ui.com/api/snackbar/#props) for available values.
   */
  alertSnackbarProps?: SnackbarProps
  /**
   * Props to pass to the Dropzone component.
   *
   * @see See [Dropzone props](https://react-dropzone.js.org/#src) for available values.
   */
  dropzoneProps?: DropzoneProps
  // might need replacement with FileProps
  /**
   * Attributes applied to the input element.
   *
   * @see See [MDN Input File attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Additional_attributes) for available values.
   */
  inputProps?: React.HTMLProps<HTMLInputElement>
  /**
   * Get alert message to display when files limit is exceed.
   *
   * *Default*: "Maximum allowed number of files exceeded. Only ${filesLimit} allowed"
   *
   * @param {number} filesLimit The `filesLimit` currently set for the component.
   */
  getFileLimitExceedMessage?(filesLimit: number): string
  /**
   * Get alert message to display when a new file is added.
   *
   * *Default*: "File ${fileName} successfully added."
   *
   * @param {string} fileName The newly added file name.
   */
  getFileAddedMessage?(fileName: string): string
  /**
   * Get alert message to display when a file is removed.
   *
   * *Default*: "File ${fileName} removed."
   *
   * @param {string} fileName The name of the removed file.
   */
  getFileRemovedMessage?(fileName: string): string
  /**
   * Get alert message to display when a file is rejected onDrop.
   *
   * *Default*: "File ${rejectedFile.name} was rejected."
   *
   * @param {Object} rejectedFile The file that got rejected
   * @param {string[]} acceptedFiles The `acceptedFiles` prop currently set for the component
   * @param {number} maxFileSize The `maxFileSize` prop currently set for the component
   */
  getDropRejectMessage?(
    rejectedFile: File,
    acceptedFiles: string[],
    maxFileSize: number,
  ): string
  /**
   * A function which determines which icon to display for a file preview.
   *
   * *Default*: If its an image then displays a preview the image, otherwise it will display an attachment icon
   *
   * @param {FileObject} fileObject The file which the preview will belong to
   */
  getPreviewIcon?(fileObject: FileObject): JSX.Element
  /**
   * Fired when the user drops files into the dropzone.
   *
   * @param {File[]} droppedFiles All the files dropped into the dropzone.
   * @param {Event} event The react-dropzone drop event.
   */
  onDrop?(files: File[], event: DropEvent): void
  /**
   * Fired when a file is rejected because of wrong file type, size or goes beyond the filesLimit.
   *
   * @param {File[]} rejectedFiles All the rejected files.
   * @param {Event} event The react-dropzone drop event.
   */
  onDropRejected?(rejectedFiles: File[], event: DropEvent): void
  /**
   * Fired when an alert is triggered.
   *
   * @param {string} message Alert message.
   * @param {string} variant One of "error", "info", "success".
   */
  onAlert?(message: string, variant: AlertColor): void
}

export interface DropzoneDialogBaseProps extends DropzoneAreaBaseProps {
  /** Sets whether the dialog is open or closed. */
  open: boolean
  /** The Dialog title. */
  dialogTitle?: string | JSX.Element
  /**
   * Props to pass to the Material-UI Dialog components.
   *
   * @see See [Material-UI Dialog](https://material-ui.com/api/dialog/#props) for available values.
   */
  dialogProps?: DialogProps
  /**
   * If `true`, the dialog stretches to `maxWidth`.
   *
   * Notice that the dialog width grow is limited by the default margin.
   */
  fullWidth?: DialogProps['fullWidth']
  /**
   * Determine the max-width of the dialog. The dialog width grows with the size of the screen.
   *
   * Set to `false` to disable `maxWidth`.
   */
  maxWidth?: DialogProps['maxWidth']
  /** Cancel button text in dialog. */
  cancelButtonText?: string
  /** Submit button text in dialog. */
  submitButtonText?: string
  /**
   * Shows previews **BELOW** the dropzone.
   *
   * **Note:** By default previews show up under in the Dialog and inside in the standalone.
   */
  showPreviews?: boolean
  /** Shows preview **INSIDE** the dropzone area. */
  showPreviewsInDropzone?: boolean
  /** Shows file name under the image. */
  showFileNamesInPreview?: boolean
}
