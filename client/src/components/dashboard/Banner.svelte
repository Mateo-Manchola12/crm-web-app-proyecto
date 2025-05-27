<script lang="ts">
    export let data: {
        first_name: string
        last_name: string
    }

    const currentTime = new Date()
    const currentHour = currentTime.getHours()

    let greeting

    if (currentHour < 12) {
        greeting = 'Buenos días'
    } else if (currentHour < 18) {
        greeting = 'Buenas tardes'
    } else {
        greeting = 'Buenas noches'
    }
</script>

<section class="bg-gradient-to-b from-primary/20 to-transparent ">
    <h1 class="text-primary pt-10 mb-5 text-center text-3xl font-bold">
        ¡{greeting}
        {data?.first_name}!
    </h1>
</section>
