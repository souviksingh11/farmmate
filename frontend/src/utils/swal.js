import Swal from 'sweetalert2';

const isDark =
  document.documentElement.getAttribute('data-bs-theme') === 'dark';

const baseConfig = {
  width: 320,
  padding: '1rem',
  backdrop: 'rgba(0,0,0,0.4)',
  background: isDark ? '#1f1f1f' : '#ffffff',
  color: isDark ? '#f1f1f1' : '#212529',
  buttonsStyling: false,
};

const baseClasses = {
  popup: 'swal-card',
  title: 'swal-title',
  htmlContainer: 'swal-text',
};

/* ---------------- CONFIRM ---------------- */
export const swalConfirm = ({
  title = 'Are you sure?',
  text = '',
  confirmText = 'Confirm',
}) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    customClass: {
      ...baseClasses,
      confirmButton: 'btn btn-sm btn-success px-3',
      cancelButton: 'btn btn-sm btn-outline-danger px-3',
    },
  });
};

/* ---------------- SUCCESS ---------------- */
export const swalSuccess = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 1800,
    showConfirmButton: false,
    customClass: {
      ...baseClasses,
      confirmButton: 'btn btn-sm btn-success px-4',
    },
  });
};

/* ---------------- ERROR ---------------- */
export const swalError = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    customClass: {
      ...baseClasses,
      confirmButton: 'btn btn-sm btn-danger px-4',
    },
  });
};

/* ---------------- LOADING ---------------- */
export const swalLoading = (title = 'Please wait...', text = '') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      ...baseClasses,
    },
  });
};

