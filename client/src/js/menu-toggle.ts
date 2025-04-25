import { $ } from '@js/dom-selector'

export function toggleMenu() {
    const menu = $('nav > ol')
    const xmark = $('[data-icon="ic:round-close"]')
    const hamburger = $('[data-icon="ic:round-menu"]')
    const button = $('#nav-button')

    function toggleMenu(isOpen: boolean) {
        menu?.classList.toggle('right-0', isOpen)
        menu?.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
        xmark?.classList.toggle('hidden', !isOpen)
        hamburger?.classList.toggle('hidden', isOpen)
    }

    button?.addEventListener('click', () => {
        const isOpen = menu?.classList.contains('right-0')
        toggleMenu(!isOpen)
    })
    menu?.addEventListener('click', () => {
        const isOpen = menu?.classList.contains('right-0')
        toggleMenu(!isOpen)
    })
}
