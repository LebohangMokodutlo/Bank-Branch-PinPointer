export const queryKeys = {
  branches: 'branches',
  places: 'places',
};

export const branchTypes = {
  branch: 'Branch',
  atm: 'Atm',
};

export const typeFilterOptions = {
  all: 'all',
  branch: branchTypes.branch,
  atm: branchTypes.atm,
};

export const routes = {
  home: '/',
  searchAnalytics: '/search-analytics',
  manageBranches: '/manage-branches',
};

export const storageKeys = {
  isAdmin: 'bank-branch-pinpointer:isAdmin',
  branchActiveOverrides: 'bank-branch-pinpointer:branchActiveOverrides',
  searchHistory: 'bank-branch-pinpointer:searchHistory',
};