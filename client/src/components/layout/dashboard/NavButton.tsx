export default function ({
    children,
    target,
    isActive,
    setWindow,
}: {
    children: string
    target: string
    isActive: boolean
    setWindow: (target: string) => void
}) {
    const handleClick = () => {
        setWindow(target)
    }
    const isActiveClass = isActive ? 'bg-secondary/40' : 'bg-transparent'
    return (
        <li>
            <button
                className={`inline-block h-full w-full cursor-pointer px-6 py-2 text-left ${isActiveClass}`}
                type="button"
                onClick={handleClick}
            >
                {children}
            </button>
        </li>
    )
}
