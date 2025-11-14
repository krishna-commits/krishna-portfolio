// Admin panel should be protected
// Add authentication middleware here
// For now, this is a basic layout

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// TODO: Add authentication check
	// if (!isAuthenticated) {
	//   redirect('/login')
	// }

	return children
}

