<template>
    <CldUploadWidget v-slot="{ open }" :uploadPreset="presetDefinintion" :options="options" @upload="show" @error="error">
        <v-file-input @click.prevent="open" variant="outlined" chips accept="image/*" prepend-icon="" prepend-inner-icon="mdi-camera"
            :label="label"></v-file-input>

    </CldUploadWidget>
</template>
<script setup lang="ts">

const files = ref([])

const props = defineProps([
    'presetDefinintion',
    'label'
])

const emits = defineEmits(['success', 'error'])
const options = ref({
   
    'cropping': true,
    'maxFiles': 1,
    'clientAllowedFormats': ['webp', 'jpg', 'jpeg', 'gif', 'png', 'ico', 'tiff'],
    'maxImageFileSize': 2000000,
    'maxFileSize': 2000000,
    
    'secure' : true,
})

function show(ev){
    console.log({'success': ev})
    emits('success', ev)
}


function error(ev){
    console.log({'error': ev})
    emits('error', ev)

}


</script>
