import * as React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'
import { DropzoneAreaBase } from './dropzone-area-base'
import { DropzoneDialogBaseProps } from './dropzone.defs'

interface DropzoneDialogBaseState extends DropzoneDialogBaseProps {
  open: boolean
  dialogTitle: string | JSX.Element
  fullWidth: DialogProps['fullWidth']
  maxWidth: DialogProps['maxWidth']
  cancelButtonText: string
  submitButtonText: string
  showPreviews: boolean
  showPreviewsInDropzone: boolean
  showFileNamesInPreview: boolean
}

/**
 * This component provides the DropzoneArea inside of a Material-UI Dialog.
 *
 * It supports all the Props and Methods from `DropzoneAreaBase`.
 */
export class DropzoneDialogBase extends React.PureComponent<
  DropzoneDialogBaseProps,
  DropzoneDialogBaseState
> {
  #defaultProps: DropzoneDialogBaseState = {
    acceptedFiles: [],
    open: false,
    dialogTitle: 'Upload file',
    fullWidth: true,
    maxWidth: 'sm',
    cancelButtonText: 'Cancel',
    submitButtonText: 'Submit',
    showPreviews: true,
    showPreviewsInDropzone: false,
    showFileNamesInPreview: true,
  }

  constructor(props: DropzoneDialogBaseProps) {
    super(props)

    this.state = merge(this.#defaultProps, props)
  }

  componentDidUpdate(prevProps: DropzoneDialogBaseProps) {
    const props = this.props
    if (!isEqual(prevProps, props)) {
      this.setState(merge(this.#defaultProps, props))
    }
  }

  render() {
    const {
      cancelButtonText,
      dialogProps,
      dialogTitle,
      fullWidth,
      maxWidth,
      onClose,
      onSave,
      open,
      submitButtonText,
      ...dropzoneAreaProps
    } = this.state

    // Submit button state
    const submitDisabled =
      dropzoneAreaProps.fileObjects === undefined ||
      dropzoneAreaProps.fileObjects.length === 0

    return (
      <Dialog
        {...dialogProps}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={onClose}
        open={open}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          <DropzoneAreaBase {...dropzoneAreaProps} />
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={onClose}>
            {cancelButtonText}
          </Button>

          <Button color="primary" disabled={submitDisabled} onClick={onSave}>
            {submitButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
