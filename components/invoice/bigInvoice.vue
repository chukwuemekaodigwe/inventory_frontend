<template>
    <v-card elevation="4" class="pa-5 pb-10">
                    <card-title class="text-caption my-2"> Invoice Template</card-title>
                    <v-row justify="center">
                        <v-col cols="6">
                            <h3 class="text-tertiary">Company Name Inc.</h3>
                            <p>Address</p>
                            <p>City, State Country</p>
                        </v-col>

                        <v-col cols="6">
                            <div class="">
                                <img src="" alt="logo" class="rounded" style="width: 100px; float: right;">
                            </div>

                        </v-col>
                        <v-col>
                            <v-divider class="border-primary" thickness="2"></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="5">
                            <p class="font-weight-medium text-tertiary">
                                Bill To
                            </p>
                            <p>Customer name</p>
                            <p>Address JJJ</p>
                            <p>City, State</p>
                        </v-col>

                        <!-- <v-col cols="3">
                                <p class="font-weight-medium">
                                    Delivered To
                                </p>
                                <p>Customer name</p>
                                <p>Address JJJ</p>
                                <p>City, State</p>
                            </v-col> -->

                        <v-col cols="7">
                            <v-row class="">
                                <v-col cols="6">
                                    <p class="font-weight-medium text-tertiary text-right"> date</p>
                                </v-col>
                                <v-col cols="6">
                                    <p class="text-right">23/07/2023</p>
                                </v-col>
                            </v-row>

                            <v-row class="subsection">
                                <v-col cols="6">
                                    <p class="font-weight-medium text-tertiary text-right"> time</p>
                                </v-col>
                                <v-col cols="6">
                                    <p class="text-right">11:00 am</p>
                                </v-col>
                            </v-row>
                            <!--
                                <v-row class="subsection">
                                    <v-col cols="6">
                                        <p class="font-weight-medium text-right">Subtotal</p>
                                    </v-col>
                                    <v-col cols="6">
                                        <p class="text-right">90980222.00</p>
                                    </v-col> --
                                </v-row> -->
                        </v-col>


                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-table density="compact">
                                <thead class="bg-primary">
                                    <th>S/N</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Slips to dhdgdj</td>
                                        <td>2</td>
                                        <td>2300.00</td>
                                        <td>4600.00</td>
                                    </tr>

                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>
                    <v-row class="">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">Subtotal</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">908800</p>
                        </v-col>

                    </v-row>

                    <v-row class="subsection">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">Tax</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">0.1%</p>
                        </v-col>

                    </v-row>

                    <v-row class="subsection">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">Discount</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right">0.0002%</p>
                        </v-col>
                        <v-divider thickness="2" color="black" class="my-2"></v-divider>
                    </v-row>

                    <v-row class="subsection">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-bold text-tertiary-darken-2">Total</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-medium text-tertiary">90980222.00</p>
                        </v-col>
                    </v-row>
                    <v-row class="subsection">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-bold text-tertiary-darken-2 ">Amount Paid</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-medium text-tertiary">90980222.00</p>
                        </v-col>
                    </v-row>
                    <v-row class="subsection">
                        <v-col cols="4">
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-bold text-tertiary-darken-2 ">Balance</p>
                        </v-col>
                        <v-col cols="4">
                            <p class="text-right font-weight-medium text-tertiary">90980222.00</p>
                        </v-col>
                    </v-row>
                    <v-card-text class="d-flex justify-center" style="position: relaive; bottom: 90x;">
                        <v-img v-for="s in status" :key="s" :src="`${s}.jpg`" style="height: 100px;"></v-img>

                    </v-card-text>
                    <v-card-action>
                        <v-divider color="darkred"></v-divider>
                        <p class="text-right text-tertiary">Sold By: Okeke Emeka</p>
                    </v-card-action>
                </v-card>
</template>



<style>
td {
    text-align: center;
}

.font-weight-medium {
    font-weight: bold;
    text-transform: uppercase;
    //color: rgba(var(--v-theme-tertiary), 0.9)!important;
}

.subsection * {
    margin-top: -10px;


}

.small-invoice p, .small-invoice th, .small-invoice td{
    font-size: .7em
    
}

.small-invoice img{
    width: 50px!important;
}

p, th, td{
    font-size: .9em;
}
</style>