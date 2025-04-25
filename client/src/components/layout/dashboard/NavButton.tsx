export default function ({ children, target }: { children: string; target: string }) {
    return (
        <li>
            <button className="inline-block h-full w-full px-6 py-2 text-left" type="button">
                {children}
            </button>
        </li>
    )
}
