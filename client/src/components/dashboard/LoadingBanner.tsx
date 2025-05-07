export default function () {
    return (
        <div className="bg-background sticky top-0 right-0 left-0 z-50 flex h-screen">
            <div
                style={{
                    top: 'calc(calc(1/2 * 100%) - calc(var(--spacing) * 6))',
                    left: 'calc(calc(1/2 * 100%) - calc(var(--spacing) * 6))',
                }}
                className="border-primary/10 border-t-primary sticky h-12 w-12 animate-spin rounded-full border-8"
            ></div>
        </div>
    )
}
