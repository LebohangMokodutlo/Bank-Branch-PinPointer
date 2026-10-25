import Modal from '../../../shared/components/Modal';

const BranchDetailsModal = ({ branch, onClose }) => {
  return (
    <Modal title={branch.name} onClose={onClose}>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-gray-500">Address</dt>
          <dd>
            {branch.address.street}, {branch.address.suburb}, {branch.address.city}, {branch.address.postalCode}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Province</dt>
          <dd>{branch.address.province}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Phone</dt>
          <dd>{branch.phone}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Type</dt>
          <dd>{branch.type === 'Atm' ? 'ATM only' : 'Full-service branch'}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd>{branch.isActive ? 'Active' : 'Inactive'}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Services</dt>
          <dd>{branch.services.join(', ')}</dd>
        </div>
      </dl>
    </Modal>
  );
};

export default BranchDetailsModal;
