const BranchList = ({ branches }) => {
  return (
    <ul>
      {branches.map((branch) => (
        <li key={branch.id}>
          <strong>{branch.name}</strong> — {branch.address.street}, {branch.address.city}
        </li>
      ))}
    </ul>
  )
};

export default BranchList;
