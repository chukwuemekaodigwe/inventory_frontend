<template>
<h5>1. Barcode with ean13 format</h5>
  <BarcodeGenerator
    :value="'1234567890128'"
    :format="'ean13'"
    :lineColor="'#000'"
    :width="4"
    :height="40"
    :elementTag="'img'"
  />

  <h5>2. Barcode with CODE39 format</h5>
  <BarcodeGenerator
    :value="'CODE39 Barcode'"
    :format="'CODE39'"
    :lineColor="'#0fe'"
    :width="4"
    :height="40"
    :elementTag="'img'"
  /> 
  
   <h5>3. Barcode with ITF14 format</h5>
  <BarcodeGenerator
    :value="'12345678901231'"
    :format="'ITF14'"
    :lineColor="'blue'"
    :width="4"
    :height="40"
    :elementTag="'img'"
  /> 

  <h5>4. Barcode with pharmacode format with svg elementTag</h5>
  <BarcodeGenerator
    :value="'1234'"
    :format="'pharmacode'"
    :lineColor="'green'"
    :width="4"
    :height="40"
    
  /> 
</template>

<script>
import BarcodeGenerator from "./components/BarcodeGenerator.vue";
export default {
  name: "PageIndex",
  components: {
    BarcodeGenerator,
  },
};
</script>