import useDashboardWindow from '@/hooks/dashboardWindow'
import NavButton from '@components/layout/dashboard/NavButton'

export default function () {
    const { $sections, sections, setWindow } = useDashboardWindow()

    return (
        <>
            {sections.map((section) => {
                return (
                    <NavButton
                        key={`nav-button-${section.name}`}
                        target={section.name}
                        setWindow={setWindow}
                        isActive={$sections[section.name]}
                    >
                        {section.label}
                    </NavButton>
                )
            })}
        </>
    )
}
