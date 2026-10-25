import Modal from '../../../shared/components/Modal';

const ToggleActiveConfirmModal = ({ branch, onCancel, onConfirm }) => {
  const action = branch.isActive ? 'deactivate' : 'activate';

  return (
    <Modal title="Confirm status change" onClose={onCancel}>
      <p className="text-sm text-gray-600">
        Are you sure you want to {action} <strong>{branch.name}</strong>?
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Switch
        </button>
      </div>
    </Modal>
  );
};

export default ToggleActiveConfirmModal;
