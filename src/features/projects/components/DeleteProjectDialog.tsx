import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";

import {
  dialogContentSx,
  dialogHeaderSx,
  dialogTitleSx,
} from "../../../components/page/pageStyles";

interface DeleteProjectDialogProps {
  open: boolean;
  projectName: string;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProjectDialog({
  open,
  projectName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isDeleting) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={dialogHeaderSx}>
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={dialogTitleSx}>
            Delete project?
          </Typography>

          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={dialogContentSx}>
        <Stack spacing={2.5}>
          <Typography color="text.secondary">
            Are you sure you want to delete <strong>{projectName}</strong>?
          </Typography>

          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          loading={isDeleting}
        >
          Delete project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
