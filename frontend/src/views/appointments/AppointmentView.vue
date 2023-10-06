<script setup>
import { ref } from 'vue'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import SelectedService from '@/components/SelectedService.vue'
import { useAppointmentsStore } from '@/stores/appointments'
import {formatCurrency} from '@/helpers'

const appointments = useAppointmentsStore()

const formatter = ref({
    date: 'DD/MM/YYYY',
    month: 'MMM'
})

const disabledDate = (date) => {
    const today = new Date()
    // Condiciones son: No dias anteriores al dia actual O No mayor a 1 mes adelante O dia no es sabado o domingo
    return date < today || date.getMonth() > today.getMonth() + 1 || [0,6].includes(date.getDay())
}

</script>

<template>
    <h2 class="text-4xl font-extrabold text-white mt-10">Detalles Cita y Resumen</h2>
    <p class="text-white text-lg mt-5">A continuación verifica la información y confirma tu cita</p>

    <h3 class="text-3xl font-extrabold text-white">Servicios</h3>

    <p v-if="appointments.noServiceSelected" class="text-white text-2xl text-center">No hay servicios seleccionados</p>

    <div v-else class="grid gap-5">
        <SelectedService
            v-for="service in appointments.services"
            :key="service._id"
            :service="service"
        />
        <p class="text-right text-white text-2xl">Total a pagar: 
            <span class="font-black">{{ formatCurrency(appointments.totalAmount) }}</span>
        </p>
    </div>

    <div class="space-y-8" v-if="!appointments.noServiceSelected">
        <h3 class="text-3xl font-extrabold text-white">Fecha y Hora</h3>

        <div class="lg:flex gap-5 items-start">
            <div class="w-full lg:w-96 flex justify-center rounded-lg">
                <VueTailwindDatepicker 
                    :disable-date="disabledDate"
                    i18n="es-mx"
                    as-single
                    no-input
                    :formatter="formatter"
                    v-model="appointments.date"
                />    
            </div> 
            <div v-if="appointments.isDateSelected" class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10 lg:mt-0">
                 <button 
                    v-for="hour in appointments.hours"
                    class="block text-blue-500 rounded-lg text-xl font-black p-3 disabled:opacity-10"
                    :class="appointments.time === hour ? 'bg-blue-500 text-white' : 'bg-white'"
                    @click="appointments.time = hour"
                    :disabled="appointments.disabledTime(hour) ? true : false"
                 >{{ hour }}</button>   
            </div>  
        </div>
    </div>

    <div class="flex justify-end" v-if="appointments.isValidReservation">
        <button 
            class="w-full md:w-auto bg-blue-500 p-3 uppercase rounded-lg font-black text-white"
            @click="appointments.saveAppointment"
        >
            Confirmar Reservación
        </button>
    </div>
</template>


