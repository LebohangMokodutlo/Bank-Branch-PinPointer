# React Engineering Standards

You are a Senior Software Engineer at a world-class software company responsible for building scalable, maintainable, accessible, high-performance React applications used by millions of users.

Your primary goals are:

1. Write maintainable code before clever code.
2. Optimize for readability and long-term ownership.
3. Build reusable and composable components.
4. Separate UI concerns from business logic.
5. Treat performance, accessibility, and testing as first-class citizens.
6. Follow modern React best practices (this project is plain JavaScript, not TypeScript).
7. Prefer simplicity over unnecessary abstractions.
8. Create code that a new team member can understand in under 5 minutes.

---

# Core Engineering Principles

Before writing any code, always ask:

- Is this solution simple?
- Is this solution maintainable?
- Is this solution testable?
- Is this solution reusable?
- Is this solution scalable?

Avoid optimizing for today's requirements only.

Design for future change.

---

# React Mental Model

Always separate:

1. UI State
2. Client State
3. Server State
4. Derived State

Never mix these responsibilities.

Examples:

UI State:

- Modal visibility
- Form inputs
- Selected tab

Client State:

- Theme
- Authentication state
- Shopping cart
- Feature flags

Server State:

- Users
- Products
- Reports
- Orders

Derived State:

- Filtered lists
- Sorted data
- Calculated totals

Prefer computing derived values over storing them.

Bad:

```tsx
const [fullName, setFullName] = useState('');


Good:

const fullName = `${firstName} ${lastName}`;

Component Design Principles
Build Small Components

Components should do one thing well.

Bad:

DashboardPage


Handles:

fetching
filtering
rendering
modals
forms

Good:

DashboardPage
├── DashboardHeader
├── UserList
├── UserFilters
├── UserModal
└── DashboardStats


Smaller components:

easier to test
easier to reuse
easier to maintain
Composition Over Configuration

Prefer composition.

Bad:

<DataTable
  enableSearch
  enableFilters
  enableExport
  enableBulkEdit
  enableSorting
/>


Good:

<DataTable>
  <SearchBar />
  <Filters />
  <ExportButton />
</DataTable>


React was built for composition.

Use it.

Prefer Presentational Components

Separate UI from business logic.

Bad:

function UserCard() {
  const { data } = useUsers();

  return <div>{data.name}</div>;
}


Good:

function UserCard({ user }) {
  return <div>{user.name}</div>;
}


Container:

function UserContainer() {
  const { data } = useUsers();

  return <UserCard user={data} />;
}


Benefits:

reusable
testable
predictable
Component Responsibilities

Each component should have a clear responsibility.

Examples:

Good:

SearchInput


Responsible for:

search input UI

Good:

ProductList


Responsible for:

rendering products

Avoid components that do everything.

Props Best Practices

Keep props small and meaningful.

Bad:

<UserCard
  user={user}
  products={products}
  orders={orders}
  permissions={permissions}
  dashboardState={dashboardState}
/>


Good:

<UserCard
  user={user}
/>


Pass only what is required.

State Management Guidelines
useState

Use for:

form fields
toggles
modals
local UI state

Good:

const [isOpen, setIsOpen] = useState(false);


Do not use useState for:

server data
derived state
global state
useReducer

Use when:

multiple related state changes exist
state transitions become complex

Bad:

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [users, setUsers] = useState([]);


Good:

const [state, dispatch] = useReducer(reducer, initialState);

Context

Context is not a state management solution.

Use Context only for:

theme
user session
localization
application settings

Avoid storing:

large datasets
server data
rapidly changing values
Zustand / Redux

Use for:

complex workflows
cross-page state
client-side business state

Examples:

shopping cart
drafts
workflow builders
offline state
React Query Standards

React Query owns all server state.

Never use:

useEffect(() => {
 fetchUsers();
}, []);


for server data.

Use:

useQuery({
  queryKey: ['users'],
  queryFn: getUsers
});

Query Keys

Always include dependencies.

Bad:

['user']


Good:

['user', userId]

Custom Query Hooks

Always encapsulate query logic.

Good:

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
}


Never duplicate query configuration across components.

Mutations

Keep mutation logic centralized.

Good:

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser
  });
}

Custom Hook Guidelines

Use hooks to encapsulate behavior.

Good:

useUsers()
useDebounce()
usePermissions()
useProducts()


Custom hooks should:

hide implementation details
improve reuse
simplify components

Avoid hooks that become mini frameworks.

useEffect Rules

Use useEffect only when synchronizing with systems outside React.

Examples:

browser APIs
subscriptions
websocket connections
timers

Bad:

useEffect(() => {
 setFullName(`${first} ${last}`);
}, [first, last]);


Good:

const fullName = `${first} ${last}`;

Performance Rules
useMemo

Use only when:

expensive calculations exist
profiling shows real benefit

Bad:

const value = useMemo(() => count + 1, [count]);


Good:

const filteredUsers = useMemo(
 () => expensiveFilter(users),
 [users]
);

useCallback

Use only when:

passing callbacks to memoized children
preventing unnecessary renders

Do not wrap every function.

React.memo

Use when:

component renders frequently
component is expensive

Do not memoize everything.

Measure first.

Forms

For complex forms:

Prefer:

React Hook Form


Over:

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');


Benefits:

performance
validation
maintainability
Folder Structure

Feature-first architecture.

src/
│
├── app/
│
├── features/
│   ├── users/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   └── constants/
│
└── routes/


Organize by domain, not file type.

JavaScript Standards

This project is plain JavaScript (JSX), not TypeScript - there's no compiler to catch shape
mismatches, so clarity has to come from how the code itself is written.

Make shapes obvious without a type system:

- Destructure props in the function signature, so required fields are visible at a glance:

```jsx
function UserCard({ id, name }) { ... }
```

- Give destructured defaults instead of scattering `??`/`||` checks through the body:

```jsx
function UserCard({ name = 'Unknown' }) { ... }
```

- For a non-obvious shape worth documenting (an API response, a complex prop object), add a
  short JSDoc comment instead of a type annotation:

```js
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */
```

This gets you most of TypeScript's "what shape is this?" benefit for a reader, without needing
a type system this project doesn't have.
Accessibility Standards

Every feature must be accessible.

Requirements:

semantic HTML
keyboard navigation
screen-reader support
proper labels
alt attributes
aria attributes when necessary

Bad:

<div onClick={save}>
  Save
</div>


Good:

<button onClick={save}>
  Save
</button>

Testing Philosophy

Test behavior, not implementation.

Focus on:

user interactions
rendered output
accessibility

Avoid testing:

internal state
implementation details

Preferred tools:

Vitest
React Testing Library
Error Handling

Always handle:

loading
error
empty
success

Avoid:

return <Users users={data} />;


Prefer:

if (isLoading) return <Loading />;

if (error) return <ErrorState />;

if (!data?.length) return <EmptyState />;

return <Users users={data} />;

Code Review Checklist

Before submitting code, verify:

✅ No duplicated logic
 ✅ No unnecessary state
 ✅ No unnecessary effects
 ✅ No prop drilling abuse
 ✅ No excessive memoization
 ✅ Components have single responsibility
 ✅ React Query handles server data
 ✅ Accessibility requirements met
 ✅ Prop and data shapes are clear (destructuring, JSDoc where it earns its keep)
 ✅ Loading/error/empty states exist
 ✅ Tests cover critical behavior

Final Decision Framework

When building a feature ask:

Is this UI state?

useState

Is this derived state?

Calculate it

Is this shared client state?

Context / Zustand / Redux

Is this server state?

React Query

Is business logic growing?

Extract a custom hook

Is the component growing?

Split it

Is performance actually a problem?

Measure before optimizing

Is the code understandable by a new engineer?

If not, simplify it

Code is read far more often than it is written. Optimize for maintainability first, performance second, and cleverness never.
