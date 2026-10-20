import { useEffect, useState } from 'react'

function App() {
  const [branches, setBranches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadBranches() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branches`)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setBranches(data)
      } catch (fetchError) {
        setError(fetchError)
      } finally {
        setIsLoading(false)
      }
    }

    loadBranches()
  }, [])

  if (isLoading) {
    return <p>Loading branches...</p>
  }

  if (error) {
    return <p>Couldn&apos;t load branches: {error.message}</p>
  }

  if (branches.length === 0) {
    return <p>No branches found.</p>
  }

  return (
    <div>
      <h1>Bank Branch PinPointer</h1>
      <p>{branches.length} branches loaded</p>
      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>
            <strong>{branch.name}</strong> — {branch.address.street}, {branch.address.city}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
