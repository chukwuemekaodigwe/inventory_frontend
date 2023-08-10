<template>
    <!-- <CldUploadWidget v-slot="{ open }" :uploadPreset="presetDefinintion" :options="options" @upload="show" @error="error"> -->
    <v-file-input @click.prevent="open" variant="outlined" chips accept="image/*" prepend-icon=""
        prepend-inner-icon="mdi-camera" :label="label"></v-file-input>

    <!-- </CldUploadWidget> -->
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

})


function open() {
    var myWidget = cloudinary.createUploadWidget({
        cloudName: 'dfl15pkea',
        uploadPreset: 'byupi2ok',

        'cropping': true,
        'maxFiles': 1,
        'clientAllowedFormats': ['webp', 'jpg', 'jpeg', 'gif', 'png', 'ico', 'tiff'],
        'maxImageFileSize': 2000000,
        'maxFileSize': 2000000,

        'secure': true
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            emits('success', result.info.secure_url)
            //console.log('Done! Here is the image info: ', result.info); 
        }else{
            emits('error', error)
        }
    }
    )

    myWidget.open()
}
function show(ev) {
    console.log({ 'success': ev })
    emits('success', ev)
}


function error(ev) {
    console.log({ 'error': ev })
    emits('error', ev)

}
onMounted(() => {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://widget.cloudinary.com/v2.0/global/all.js')
    document.head.appendChild(recaptchaScript)

})

</script>
