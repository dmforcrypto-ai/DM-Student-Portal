const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold dark:text-white">Good afternoon, Denmark</h1>
            <p className="text-gray-700 dark:text-white">{new Date().toLocaleDateString('en-US', {
                weekday:'long',
                month: 'long',
                day: 'numeric'
            })}</p>
        </div>
    )

}

export default Dashboard;