<script  setup>
import { useRoute, RouterView } from 'vue-router';
import  { useAppointmentsStore } from '../../stores/appointments'
import { onMounted } from 'vue';

const route = useRoute()
const appointments = useAppointmentsStore()

onMounted(() => {
    appointments.clearAppointmentData()
})

</script>

<template>
    <nav class="my-5 flex gap-3">
        <RouterLink 
            :to="{ name: 'new-appointment'}" 
            class="flex-1 text-center p-3 uppercase font-extrabold hover:bg-blue-600 hover:text-white "
            :class="route.name === 'new-appointment' ? 'text-white bg-blue-500' : 'bg-white text-blue-500'">
            
            Servicios
        </RouterLink>
        <RouterLink 
            :to="{ name: 'appointment-details'}" 
            class="flex-1 text-center p-3 uppercase font-extrabold hover:bg-blue-600 hover:text-white"
            :class="route.name === 'appointment-details' ? 'text-white bg-blue-500' : 'bg-white text-blue-500'">
            Cita y Resumen
        </RouterLink>
    </nav>
    <div class="space-y-8">
        <RouterView/>
    </div>
</template>

