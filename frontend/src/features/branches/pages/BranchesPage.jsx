import { useBranches } from '../hooks/useBranches'
import BranchList from '../components/BranchList'

const BranchesPage = () => {
  const { data: branches, isLoading, error } = useBranches();

  if (isLoading) return <p>Loading branches...</p>
  if (error) return <p>Couldn&apos;t load branches: {error.message}</p>
  if (!branches?.length) return <p>No branches found.</p>

  return (
    <div>
      <h1>Bank Branch PinPointer</h1>
      <p>{branches.length} branches loaded</p>
      <BranchList branches={branches} />
    </div>
  )
}

export default BranchesPage;
