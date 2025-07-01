export function isAuthenticated(): boolean {
  return !!localStorage.getItem('user');
}
