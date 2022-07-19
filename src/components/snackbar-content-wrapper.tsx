import {
  CheckCircle,
  Close,
  Error,
  Info,
  SvgIconComponent,
  Warning,
} from '@mui/icons-material'
import {
  AlertColor,
  IconButton,
  SnackbarContent,
  Typography,
} from '@mui/material'
import * as React from 'react'

interface SnackbarContentWrapperProps {
  variant: AlertColor
  message: string | JSX.Element
  onClose(): void
}

interface SnackbarContentWrapperState extends SnackbarContentWrapperProps {
  Icon: SvgIconComponent
}

export class SnackbarContentWrapper extends React.PureComponent<
  SnackbarContentWrapperProps,
  SnackbarContentWrapperState
> {
  #variantIcon: { [key in AlertColor]: SvgIconComponent } = {
    success: CheckCircle,
    warning: Warning,
    error: Error,
    info: Info,
  }

  constructor(props: SnackbarContentWrapperProps) {
    super(props)

    this.state = {
      ...props,
      Icon: this.#variantIcon[props.variant],
    }
  }

  render() {
    const { Icon, message, onClose } = this.state
    return (
      <SnackbarContent
        aria-describedby="client-snackbar"
        message={
          <Typography>
            <Icon />
            {message}
          </Typography>
        }
        action={
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        }
      />
    )
  }
}

// const styles = (theme) => ({
//   successAlert: {
//     backgroundColor: theme.palette.success.main,
//   },
//   errorAlert: {
//     backgroundColor: theme.palette.error.main,
//   },
//   infoAlert: {
//     backgroundColor: theme.palette.info.main,
//   },
//   warningAlert: {
//     backgroundColor: theme.palette.warning.main,
//   },
//   message: {
//     display: 'flex',
//     alignItems: 'center',
//     '& > svg': {
//       marginRight: theme.spacing(1),
//     },
//   },
//   icon: {
//     fontSize: 20,
//     opacity: 0.9,
//   },
//   closeButton: {},
// })

// export default withStyles(styles, { name: 'MuiDropzoneSnackbar' })(
//   SnackbarContentWrapper,
// )
