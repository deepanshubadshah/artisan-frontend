import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from "@mui/material";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={true}
      onClose={onCancel}
      aria-labelledby="delete-confirmation-dialog"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'confirm-delete-modal'
      }}
    >
      <DialogTitle 
        className="confirm-delete-modal-title"
      >
        <WarningRoundedIcon color="warning" />
        Confirm Deletion
      </DialogTitle>
      
      <DialogContent className="confirm-delete-modal-content">
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions className="confirm-delete-modal-actions">
        <Button 
          onClick={onCancel}
          color="secondary"
          variant="outlined"
          className="confirm-delete-modal-cancel-btn"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;