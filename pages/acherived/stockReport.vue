<template>
  <v-sheet class="m-0 m-n2" elevation="6">
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
      <v-tab :value="1">Landscape</v-tab>
      <v-tab :value="2">City</v-tab>
      <v-tab :value="3">Abstract</v-tab>
    </v-tabs>


    <!-- </v-window-item>
    </v-window> -->



    <v-toolbar class="mb-10 px-5">

      <v-btn size="small" v-if="!search" @click="initialize()"
        :variant="(!isHistory && !isTransfer && !isRemovals) ? 'outlined' : 'none'" color="success"
        prepend-icon="mdi-cart">Curr. Stocks</v-btn>

      <v-divider :inset="true" v-if="!search" vertical thickness="1" class="mx-5"></v-divider>
      <v-btn size="small" v-if="!search" @click="getTransferredStock" :variant="isTransfer ? 'outlined' : 'none'"
        color="info" prepend-icon="mdi-reply"> Recent Transfers</v-btn>

      <v-divider :inset="true" v-if="!search" vertical thickness="1" class="mx-5"></v-divider>
      <v-btn size="small" v-if="!search" @click="getRemovedStock" :variant="isRemovals ? 'outlined' : 'none'" color="info"
        prepend-icon="mdi-delete"> Recent Removals</v-btn>
      <v-divider :inset="true" v-if="!search" vertical thickness="1" class="mx-5"></v-divider>
      <v-btn size="small" v-if="!search" @click="getStockHistory" :variant="isHistory ? 'outlined' : 'none'" color="error"
        prepend-icon="mdi-history">All Records</v-btn>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-window v-model="tab">
      <v-window-item value="1">
        <!-- Data table for History -->
        <v-data-table classs="px-5" :headers="headers" :items="desserts2" :sort-by="[{ key: 'id', order: 'desc' }]"
          class="elevation-1" v-model="selected" show-select :loading="loading"
          :items-per-page="configStore.tablePager.perPage">
          <template v-slot:top>
            <v-toolbar class="flex px-3" density="compact">

              <v-text-field type="date" clearable label="Start Date" v-model="searchByDate.start_date"
                variant="underlined" @update:model-value="getStockByDate"></v-text-field>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
              <v-text-field type="date" clearable label="End Date" v-model="searchByDate.end_date" variant="underlined"
                @update:model-value="getStockByRange"></v-text-field>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
              <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details
                style="z-index: 99" @input="isHistory ? searchStockHistory() : ''">
              </v-text-field>

            </v-toolbar>
          </template>

          <template v-slot:bottom v-if="isHistory">
            <div class="text-center pt-2 d-flex" style="flex-flow: row wrap; justify-content: space-around;">
              <v-spacer></v-spacer>
              <v-pagination v-model="page" @update:model-value="loadItems" :length="configStore.tablePager.totalItems"
                :show-first-last-page="true"></v-pagination>
            </div>
          </template>
          <template v-slot:item.type="{ item }">
            <v-chip :color="getColor(item.raw.type.id)">
              {{ item.raw.type.name }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" size="small" class="me-2" @click="viewItem(item.raw)">
              mdi-eye
            </v-icon>
            <v-icon size="small" v-if="item.raw.type.id != 2" class="me-2" @click="editItem(item.raw)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item.raw)">
              mdi-delete
            </v-icon>
          </template>

        </v-data-table>
      </v-window-item>

      <v-window-item value="2">
        <!--- Data Table fro transferred stocks-->

        <v-data-table classs="px-5" :headers="trans_headers" :items="transferred"
          :sort-by="[{ key: 'id', order: 'desc' }]" class="elevation-1" v-model="selected" :search="search"
          :items-per-page="20">
          <template v-slot:top>
            <v-toolbar class="flex pr-2" density="compact">
              <v-btn v-if="selected.length" size="large" class="ml-0" prepend-icon="mdi-delete" color="error"
                @click="deleteItem(1)">Delete </v-btn>
              <v-btn v-else prepend-icon="mdi-filter" size="large" class="ml-0" color="primary"></v-btn> &nbsp; &nbsp;


              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>

              <v-text-field type="date" clearable label="Start Date" v-model="searchByDate.start_date"
                variant="underlined" @update:model-value="getStockByDate"></v-text-field>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
              <v-text-field type="date" clearable label="End Date" v-model="searchByDate.end_date" variant="underlined"
                @update:model-value="getStockByRange"></v-text-field>
            </v-toolbar>
          </template>
          <!-- 
      <template v-slot:bottom v-if="isHistory">
        <div class="text-center pt-2 d-flex" style="flex-flow: row wrap; justify-content: space-around;">
          <v-spacer></v-spacer>
          <v-pagination v-model="page" @update:model-value="loadItems" :length="configStore.tablePager.totalItems"
            :show-first-last-page="true"></v-pagination>
        </div>
      </template> -->

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatus(item.raw.item.status).color">
              {{ getStatus(item.raw.item.status).name }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" size="small" class="me-2" @click="viewItem(item.raw)">
              mdi-eye
            </v-icon>
            <!-- <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon> -->
            <v-icon size="small" @click="deleteItem(item.raw)">
              mdi-delete
            </v-icon>
          </template>

        </v-data-table>

      </v-window-item>

      <v-window-item value="3">
        <!--- Data Table fro removed stocks-->

        <v-data-table classs="px-5" :headers="removal_header" :search="search" :items="removals"
          :sort-by="[{ key: 'id', order: 'desc' }]" class="elevation-1" v-model="selected" :items-per-page="20">
          <template v-slot:top>
            <v-toolbar class="flex pr-2" density="compact">
              <v-btn v-if="selected.length" size="large" class="ml-0" prepend-icon="mdi-delete" color="error"
                @click="deleteItem(1)">Delete </v-btn>
              <v-btn v-else prepend-icon="mdi-filter" size="large" class="ml-0" color="primary"></v-btn> &nbsp; &nbsp;

              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>

              <v-text-field type="date" clearable label="Start Date" v-model="searchByDate.start_date"
                variant="underlined" @update:model-value="getStockByDate"></v-text-field>
              <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
              <v-text-field type="date" clearable label="End Date" v-model="searchByDate.end_date" variant="underlined"
                @update:model-value="getStockByRange"></v-text-field>
            </v-toolbar>
          </template>

          <!-- <template v-slot:bottom v-if="isHistory">
        <div class="text-center pt-2 d-flex" style="flex-flow: row wrap; justify-content: space-around;">
          <v-spacer></v-spacer>
          <v-pagination v-model="page" @update:model-value="loadItems" :length="configStore.tablePager.totalItems"
            :show-first-last-page="true"></v-pagination>
        </div>
      </template> -->
          <template v-slot:item.type="{ item }">
            <v-chip :color="getColor(item.raw.type.id)">
              {{ item.raw.type.name }}
            </v-chip>
          </template>


          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" size="small" class="me-2" @click="viewItem(item.raw)">
              mdi-eye
            </v-icon>
            <v-icon size="small" class="me-2" @click="editItem(item.raw)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item.raw)">
              mdi-delete
            </v-icon>
          </template>


        </v-data-table>

      </v-window-item>

      <v-window-item value="4">
        <!-- Data table for Stock record only -->
        <v-data-table classs="px-5" :headers="headers2" :items="desserts" :sort-by="[{ key: 'sn', order: 'desc' }]"
          class="elevation-1" v-model="stock.selected" show-select :loading="loading" :items-per-page="20"
          :search="search">
          <template v-slot:top>
            <v-toolbar density="compact" class="flex pa-0 ma-0">
              <v-spacer></v-spacer>

              <v-btn prepend-icon="mdi-plus" size="small" color="primary" @click="dialog = true">Add</v-btn> &nbsp; &nbsp;
              <v-btn prepend-icon="mdi-reply" size="small" color="primary"
                @click="transferDialogue = true">Transfer</v-btn>
              <v-btn prepend-icon="mdi-reply" size="small" color="primary" @click="priceDialog = true">Change
                Price</v-btn>
              <v-btn prepend-icon="mdi-delete" size="small" color="error" @click="removeDialog = true">Remove</v-btn>
              &nbsp;
              &nbsp;
            </v-toolbar>
          </template>
        </v-data-table>

      </v-window-item>

    </v-window>
    <!-- for stock add and view -->

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5"> {{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="stockForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products"
                    item-title="name" item-value="id" chips return-object label="Select Products"></v-autocomplete>
                </v-col>
                <span class="d-flex flex-row w-100" v-for="product in stock.selected">
                  <v-col cols="6" md="6">
                    <v-textarea variant="outlined" rows="1" readonly color="info" :model-value="product.name"
                      label="Product"> </v-textarea>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field :rules="mainRule" variant="outlined" v-model="product.qty" type="number" step="0.00001"
                      min="0" label="Quantity*" required></v-text-field>
                  </v-col>
                </span>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-autocomplete variant="underlined" :items="branches" item-title="title" item-value="id"
                    v-model="stock.branch" label="Initial Location"></v-autocomplete>
                </v-col>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :rules="requiredRule" v-model="stock.removeReason"
                    label="Brief Note(optional)"></v-textarea>
                </v-col>

              </v-row>

            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('add')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveNewStock">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Change Price-->
    <v-row justify="center">
      <v-dialog v-model="priceDialog" persistent width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h6"> Change Product Price</span>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="priceForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products"
                    item-title="name" item-value="id" chips clearable return-object
                    label="Select Products"></v-autocomplete>
                </v-col>

                <span class="d-flex flex-row w-100" v-for="product in stock.selected">

                  <v-col cols="6" md="6">
                    <v-text-field rows="1" :rules="requiredRule" variant="outlined" v-model="product.costprice"
                      placeholder="Cost price" type="number" :label="`New Cost price for ${product.name}`" required>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field rows="1" :rules="mainRule" variant="outlined" v-model="product.sellingprice"
                      placeholder="Selling price" type="number" :label="`New Selling price for ${product.name}`"
                      step="0.00001" min="0" required></v-text-field>
                  </v-col>
                </span>
                <!-- <v-col cols="12">
                <v-select variant="underlined" :items="branches" item-title="title" item-value="id" v-model="stock.branch"
                  label="Initial Location"></v-select>
              </v-col> -->

              </v-row>-
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('changeprice')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveUpdatePrice">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Remove Stock-->
    <v-row justify="center">
      <v-dialog v-model="removeDialog" persistent width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h6"> Remove Stock</span>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="removeForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products"
                    item-title="name" item-value="id" chips clearable return-object
                    label="Select Products"></v-autocomplete>
                </v-col>

                <span class="d-flex flex-row w-100" v-for="product in stock.selected">
                  <v-col cols="6" md="6">
                    <v-textarea variant="outlined" rows="1" readonly color="info" :model-value="product.name"
                      label="Product"> </v-textarea>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field :rules="mainRule" variant="outlined" v-model="product.qty" type="number" step="0.00001"
                      min="0" label="Quantity*" required></v-text-field>
                  </v-col>
                </span>

                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" v-model="stock.removeReason" label="Reasons for Removal"></v-textarea>
                </v-col>
                <!-- <v-divider class="my-2"></v-divider>
              <v-col cols="12">
                <v-select variant="underlined" :items="branches" item-title="name" item-value="id" v-model="stock.branch"
                  label="Business Location"></v-select>
              </v-col> -->

              </v-row>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('remove')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveRemoveStock">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Transfer dialog-->
    <v-row justify="center">
      <v-dialog v-model="transferDialogue" persistent width="500px">

        <v-card>
          <v-card-title>
            <span class="text-h5"> Transfer Stock </span>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="transferForm">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products"
                    item-title="name" item-value="id" chips clearable return-object
                    label="Select Products"></v-autocomplete>
                </v-col>

                <span class="d-flex flex-row w-100" v-for="product in stock.selected">
                  <v-col cols="6" md="6">
                    <v-textarea variant="outlined" rows="1" readonly color="info" :model-value="product.name"
                      label="Product"> </v-textarea>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field :rules="mainRule" variant="outlined" v-model="product.qty" type="number" step="0.00001"
                      min="0" label="Quantity*" required></v-text-field>
                  </v-col>
                </span>

                <v-col cols="12" md="6">
                  <v-autocomplete :rules="requiredRule" variant="underlined" :items="branches" item-title="title"
                    item-value="id" v-model="stock.from" label="From"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :rules="requiredRule" variant="underlined" :items="branches" item-title="title"
                    item-value="id" v-model="stock.to" label="To Location"></v-autocomplete>
                </v-col>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :rules="requiredRule" v-model="stock.removeReason"
                    label="Reasons for the Transfer"></v-textarea>
                </v-col>

              </v-row>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('transfer')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="transferItem">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>


    <!-- DELETE DIALOG-->

    <v-row justify="center">
      <v-dialog v-model="deleteDialog" persistent width="300px">
        <v-card aria-multiline="true" class="px-2 py-1">
          <v-card-text multiline>
            Do you really want to delete these items?
          </v-card-text>

          <v-card-actions class="d-flex row justify-content-end">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="success" @click="deleteConfirm"> Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Edit Dialog-->
    <v-row justify="center">
      <v-dialog v-model="editDialog" persistent width="500px">

        <v-card>
          <v-card-title>
            <span class="text-h5"> Edit Stock</span>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="editForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-select variant="outlined" v-model="stock.product" :items="products" item-title="name" item-value="id"
                    return-object label="Select Products"></v-select>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field :rules="mainRule" variant="outlined" v-model="stock.qty" type="number" step="0.00001"
                    min="0" label="Quantity*" required></v-text-field>
                </v-col>

                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-select variant="outlined" :items="branches" item-title="title" item-value="id" v-model="stock.branch"
                    label="Initial Location"></v-select>
                </v-col>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :rules="requiredRule" v-model="stock.removeReason"
                    label="Brief Note(optional)"></v-textarea>
                </v-col>
              </v-row>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('edit')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveEdit">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- View Dialog-->
    <v-row justify="center">
      <v-dialog v-model="viewDialog" persistent width="500px">

        <v-card>
          <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
            <span class="text-medium text-uppercase"> {{ dialogTitle }} </span>

            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>

          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form validate-on="blur" ref="viewForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field variant="outlined" :readonly="readonly" v-model="stock.product" color="info"
                    label="Product">
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field :rules="mainRule" variant="outlined" v-model="stock.qty" color="info" type="number"
                    step="0.00001" min="0" label="Quantity*" :readonly="readonly" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="stock.branch" label="Location" variant="outlined" color="info"></v-text-field>
                </v-col>

                <v-divider class="my-2"></v-divider>
                <v-row>
                  <v-col cols="6">
                    <small>Stock type</small>&nbsp;
                    <v-chip :color="getColor(stock.type.id)">
                      {{ stock.type.name }}
                    </v-chip>
                  </v-col>

                  <v-col cols="6" v-if="stock.type.id == 2">
                    <small>Status: &nbsp;</small>
                    <v-chip :color="getStatus(stock.status).color">
                      {{ getStatus(stock.status).name }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :readonly="readonly" :rules="requiredRule" v-model="stock.removeReason"
                    label="Comment"></v-textarea>
                </v-col>

              </v-row>

            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close">
              Close
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- view for transferred stock -->

    <v-row justify="center">
      <v-dialog v-model="transferredItemDialog" persistent width="500px">

        <v-card>
          <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
            <span class="text-medium text-capitalize"> Transfer of {{ dialogTitle }}</span>
            <v-spacer></v-spacer>

            <v-chip :color="getStatus(stock.item.status).color">
              {{ getStatus(stock.item.status).name }}
            </v-chip>

            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('transferred')"></v-btn>

          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="transferredItemForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field :model-value="stock.product" label="Product" readonly variant="outlined"
                    color="info"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field :rules="mainRule" variant="outlined" :model-value="stock.no_items" type="number"
                    step="0.00001" min="0" label="Quantity*" :readonly="readonly"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field type="date" variant="outlined" :readonly="readonly" :model-value="stock.created_at"
                    label="Transfer Date"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field type="date" variant="outlined" :readonly="readonly" :model-value="stock.updated_at"
                    label="Receival Date"></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field :model-value="stock.from_branch" label="From" variant="outlined" readonly
                    color="info"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field :model-value="stock.title" label="To" variant="outlined" readonly
                    color="info"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field variant="outlined" :readonly="readonly" :model-value="stock.user"
                    label="Transfered By"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field variant="outlined" :readonly="readonly" :model-value="stock.receiver"
                    label="Received By"></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :readonly="readonly" :model-value="stock.reason"
                    label="Comment"></v-textarea>
                </v-col>

              </v-row>

            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('transferred')">
              Close
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </v-sheet>
</template>

<script>
import { mapState, storeToRefs } from 'pinia'
import { useConfigStore } from '~~/store/config'
import { useBranchStore } from '~~/store/branchStore'
import { useStockStore } from '~~/store/stocks'
import { useUsersStore } from '~~/store/users'
import { useProductStore } from '~~/store/productsStore'

import { formatDate } from '../composables/getFilters'

export default {
  data() {
    return {
      page: 1,
      configStore: useConfigStore(),
      productStore: useProductStore(),
      stocksStore: useStockStore(),
      branchStore: useBranchStore(),
      usersStore: useUsersStore(),

      tab: 1,
      isHistory: false,
      selected: [],
      dialog: false,
      loading: false,
      search: '',

      options: {},
      transferDialogue: false,
      deleteDialog: false,
      removeDialog: false,
      priceDialog: false,
      editDialog: false,
      viewDialog: false,
      transferredItemDialog: false,
      delete_item: [],
      searchByDate: {
        start_date: '',
        end_date: '',
        loaded: false
      },
      stock: {
        product: '',
        qty: '',
        branch: null,
        costprice: '',
        sellingprice: '',
        from: null,
        to: null,
        selected: null,
        removeReason: null,
      },
      readonly: true,
      headers: [
        {
          title: 'Date',
          align: 'start',
          sortable: true,
          key: 'date',
        },

        { title: 'product', key: 'product' },
        { title: 'sku', key: 'sku' },
        { title: 'Stock Type', key: 'type' },
        { title: 'Quantity', key: 'no_items' },
        { title: 'Approved', key: 'user' },
        { title: 'Note', key: 'reason' },

        { title: 'StockId', key: 'stock_id' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],

      headers2: [
        {
          title: 'S/N',
          align: 'start',
          sortable: true,
          key: 'serial',
        },
        { title: 'Product Name', key: 'name' },
        { title: ' SKU', key: 'sku' },
        { title: 'Quantity ', key: 'inStockQty' },
        { title: 'Unit', key: 'units' },
        { title: 'Purchase Price', key: 'costprice' },
        { title: 'Selling price', key: 'sellingprice' },
        { title: 'Alert Level', key: 'alert_level' },

        //    { title: 'Actions', key: 'actions', sortable: false },
      ],



      trans_headers: [
        {
          title: 'Date',
          align: 'start',
          sortable: true,
          key: 'date',
        },

        { title: 'product', key: 'product' },
        { title: 'sku', key: 'sku' },
        { title: 'Quantity', key: 'no_items' },
        { title: 'Transferred From', key: 'from_branch' },
        { title: 'To', key: 'title' },

        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', sortable: false },

      ],
      transferred: [],
      removals: [],
      removal_header: [

        {
          title: 'Date',
          align: 'start',
          sortable: true,
          key: 'date',
        },

        { title: 'product', key: 'product' },
        { title: 'sku', key: 'sku' },

        { title: 'Quantity', key: 'no_items' },
        { title: 'Removed By', key: 'user' },
        { title: 'Reason ', key: 'reason' },

        { title: 'Actions', key: 'actions', sortable: false },

      ],
      isTransfer: false,
      isRemovals: false,

      dialogTitle: 'New Stock',
      desserts: [],
      desserts2: [],
      mainRule: [
        v => !!v || 'This field is required',
        v => (v && v > 0) || 'The value must be greater than zero',
        v => (/[0-9]/.test(v)) || 'Please enter a numerical value'
      ],

      requiredRule: [
        v => !!v || 'This field is required',
      ],

    }
  },

  watch: {
    selected(old, selectNew) {
      console.log({ 'new': selectNew })
      console.log({ 'old_selected': old })
    }
  },

  created() {
    this.products = this.productStore.products
    this.initialize()
    console.log('Yeah')
  },

  methods: {

    async getStockByDate() {
      const date = this.searchByDate.start_date
      if (!date) {

        if (this.isTransfer) {
          return this.getTransferredStock()
        } else if (this.isRemovals) {
          return this.getRemovedStock()
        } else {
          return this.getStockHistory()
        }

      }

      if (this.searchByDate.end_date) {
        return this.getStockByRange()
      }

      let type = 0
      if (this.isTransfer) {
        type = 2
      } else if (this.isRemovals) {
        type = 3
      }

      this.$api.post('/api/stocks/getByDate', { 'date': date, 'type': type }, { headers: { 'Access-Control-Allow-Origin': '*' } }).then((res) => {
        // console.log(res)
        const result = res.data.stocks
        //console.log(result)
        this.getStockHistory(result, true)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occurred'
          console.log(err)
        })
    },

    async getStockByRange() {

      const start = this.searchByDate.start_date
      const end = this.searchByDate.end_date

      if (!end || !start) {

        if (this.isTransfer) {
          return this.getTransferredStock()
        } else if (this.isRemovals) {
          return this.getRemovedStock()
        } else {
          return this.getStockHistory()
        }

      }

      let type = 0
      if (this.isTransfer) {
        type = 2
      } else if (this.isRemovals) {
        type = 3
      }


      this.$api.post('/api/stocks/getByRange', { 'start': start, 'end': end, 'type': type }).then((res) => {
        // console.log(res.data)
        const result = res.data.stocks
        this.getStockHistory(result, true)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occurred'
          console.log(err.response.data)
        })
    },

    async getStockHistory(payload, loaded = false) {

      let result = null
      if (!loaded) {

        await this.$api.get('/api/stocks/getStockHistory/').then((res) => {
          console.log(res.data)
          result = res.data.stocks
          this.isHistory = true
          this.isTransfer = false
          this.isRemovals = false
        })
          .catch((err) => {
            this.configStore.alert_msg = 'An error occurred'
            console.log(err)
          })
      } else {
        result = payload
      }
      console.log({ "result": result })
      this.configStore.updatePaginator(result)
      const item = []; let i = 1
      result.data.forEach((el) => {
        //console.log(this.branchStore.getBranchById(el.branch_id))
        const typename = (el.type == 1) ? 'PURCHASE' : ((el.type == 2) ? 'TRANSFER' : 'REMOVAL')
        let a = {
          'date': new Date(el.created_at).toLocaleDateString('en-gb'),
          'type': { 'name': typename, 'id': el.type },
          'product': el.name,
          'sku': el.sku,
          'user': this.usersStore.getUserById(el.registered_by).name,
          'no_items': el.qty < 0 ? ((el.qty * -1).toLocaleString('en-gb')) : el.qty.toLocaleString('en-gb'),
          'product_id': el.product_id,
          'id': el.id,
          'reason': el.brief_note,
          'stock_id': el.stockId,
          'title': this.branchStore.getBranchById(el.branch_id).title,
          'branch': el.branch_id,

          'item': el
        }

        if (this.isTransfer) {
          a.from_branch = this.branchStore.getBranchById(el.from).title

        }

        item.push(a)
      })
      if (this.isTransfer) {
        this.transferred = item
      } else if (this.isRemovals) {
        this.removals = item
      } else {

        this.desserts2 = item
      }

    },

    /**
     * For showing the transfer datatable
     */
    getTransferredStock() {
      this.$api.get('/api/stocks/getTransferredStock').then((res) => {
        const result = res.data.stocks
        console.log(result)
        this.isHistory = false
        this.isTransfer = true
        this.isRemovals = false
        return this.getStockHistory(result, true)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occurred'
          console.log(err.response.data)
        })
    },

    /**
     * For the removed table
     */
    getRemovedStock() {

      this.$api.get('/api/stocks/getRemovedStock').then((res) => {
        const result = res.data.stocks
        console.log(result)
        this.isHistory = false
        this.isTransfer = false
        this.isRemovals = true
        return this.getStockHistory(result, true)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occurred'
          console.log(err.response.data)
        })
    },


    searchStockHistory() {
      const searchTerm = this.search
      console.log(searchTerm)

      // if (this.isTransfer) {
      //   return this.getTransferredStock()
      // } else if (this.isRemovals) {
      //   return this.getRemovedStock()
      // } else if (!searchTerm && this.isHistory) {
      //   return this.getStockHistory()
      // }


      this.$api.post('/api/stocks/searchStock', { 'searchKey': searchTerm }).then((res) => {
        const result = res.data.stocks
        console.log(res.data)
        this.getStockHistory(result, true)
      })
        .catch((err) => {

          this.configStore.alert_msg = 'an error occured during searching'
          console.log(err.message)
        })

    },

    loadItems(ev) {
      const path = `${this.configStore.tablePager.pageUrl}?page=${ev}`
      if (this.search) {
        this.$api.post(path, { 'searchKey': this.search }).then((res) => {
          const result = res.data.stocks
          this.getStockHistory(result, true)
          //console.log(result)
        })
          .catch((err) => {
            this.configStore.alert_msg = 'An error occured'
            console.log(err)
          })
      } else {
        this.$api.get(path).then((res) => {
          const result = res.data.stocks
          this.getStockHistory(result, true)

        })
          .catch((err) => {
            this.configStore.alert_msg = 'An error occured'
            console.log(err)
          })
      }

    },

    async saveNewStock() {
      const payload = this.stock.selected
      console.log(payload)
      //throw new Error
      const reason = this.stock.removeReason
      if (this.stock.branch) {
        await this.$api.post('api/stocks/saveNewStock', { 'selected': payload, 'reason': reason, 'branch': this.stock.branch }).then((res) => {
          console.log(res.data)
          //this.isHistory = true
          this.configStore.alert_msg = 'Stock Successfully added'
          this.$refs.stockForm.reset()
          this.dialog = false
        })
          .catch((err) => {
            this.configStore.alert_msg = 'An error occured'
            console.log(err)
          })
      } else {
        this.configStore.alert_msg = 'Please select intial location'
      }

    },

    deleteItem(v = '') {

      if (v) {
        let item = []
        if (this.selected.length) {
          item = this.selected
          console.log(item)
        } else {
          item.push(v.id)
          console.log(item)
        }
        this.deleteDialog = true
        this.delete_item = item
      } else {
        this.configStore.alert_msg = 'Please select items to delete!'
      }
    },

    async deleteConfirm() {
      const item = this.delete_item
      await this.$api.post('/api/stocks/deleteStock', { 'item': item }).then((res) => {
        console.log(res.data)
        this.configStore.alert_msg = 'Successfully deleted'
        this.deleteDialog = false
      })
        .catch((err) => {
          console.log(err.response)
          this.configStore.alert_msg = 'An error occured during deletion'
        })

    },

    async transferItem() {
      const reason = this.stock.removeReason
      this.loading = true
      const payload = this.stock.selected

      this.$api.post('/api/stocks/transferStock', { 'selected': payload, 'reason': reason, 'from': this.stock.from, 'to': this.stock.to }).then((res) => {

        this.configStore.alert_msg = 'Successfully transfered'
        this.$refs.transferForm.reset()
        this.transferDialogue = false
        console.log(res)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occurred'
          console.log(err)
        })
      this.loading = false
    },

    async saveRemoveStock() {

      const payload = this.stock.selected
      const reason = this.stock.removeReason
      console.log(payload)
      if (reason && payload.length) {
        await this.$api.post('/api/stocks/removeStock', { 'selected': payload, 'reason': reason, 'branch': this.stock.branch }).then((res) => {
          //console.log(res.data)
          this.configStore.alert_msg = 'Successfully Removed'
          this.$refs.removeForm.reset()
          this.removeDialog = false
        })
          .catch((err) => {
            console.log(err)
            this.configStore.alert_msg = 'An error occurred'
          })
      } else {
        this.configStore.alert_msg = 'Please provide reasons for the removal'
      }

    },

    async saveUpdatePrice() {
      const payload = this.stock.selected
      console.log(payload)
      console.log(this.products)
      if (payload.length) {
        this.$api.post('/api/products/changePrice', { 'products': payload }).then((res) => {
          const result = res.data.products
          result.forEach((el) => {
            this.productStore.updateProduct(el)
          })

          this.configStore.alert_msg = 'Updated Successfully'
          this.priceDialog = false;
          this.$refs.priceForm.reset()
        })
          .catch((err) => {
            this.configStore.alert_msg = 'An error occurred'
            console.log(err.response)
          })
      }
    },


    editItem(e) {
      console.log(e)
      //throw new Error('hi')
      this.stock.product = { name: e.product, id: e.product_id }
      this.stock.branch = { name: e.title, id: e.branch }
      this.stock.qty = parseInt(e.no_items)
      this.stock.removeReason = e.reason
      this.stock.id = e.id
      this.editDialog = true

      //console.log(this.stock.selected)
    },

    viewItem(e) {
      console.log(e)

      this.dialogTitle = e.product
      this.stock.product = e.product
      this.stock.branch = e.title
      this.stock.qty = (e.no_items)
      this.stock.removeReason = e.reason
      this.stock.type = e.type
      this.stock.status = e.item.status
      if (this.isTransfer) {
        this.stock = e
        this.stock.created_at = formatDate(new Date(e.item.created_at))

        if (e.item.received_by) {
          this.receiver = this.usersStore.getUserById(e.item.received_by).name
          this.stock.updated_at = formatDate(new Date(e.item.updated_at))
        }

        this.transferredItemDialog = true
      } else {
        this.viewDialog = true
      }


      //console.log(this.stock.selected)
    },


    saveEdit() {
      // console.log(this.stock.selected)
      const payload = {
        'product': this.stock.product,
        'branch': this.stock.branch,
        'qty': this.stock.qty,
        'reason': this.stock.removeReason,
        'id': this.stock.id
      }
      if (payload.qty && payload.product.name) {
        this.$api.patch('/api/stocks/editStock', { 'payload': payload }).then((res) => {
          this.configStore.alert_msg = 'Updated Successfully'
          console.log({ 'result': res.data })
          this.$refs.editForm.reset()
          this.editDialog = false;
        })
          .catch((err) => {

            this.configStore.alert_msg = 'An error occurred'
            console.log(err)
          })
      } else {
        this.configStore.alert_msg = 'Please fill up the form & make the correct changes'
      }
    },


    close(item = '') {
      if (item == 'add') {
        this.$refs.stockForm.reset(); this.dialog = false;
      } else if (item == 'edit') {
        //this.$refs.editForm.reset();
        this.editDialog = false;
      } else if (item == 'transfer') {
        this.transferDialogue = false; this.$refs.transferForm.reset()
      }
      else if (item == 'transferred') {
        this.transferredItemDialog = false; this.$refs.transferredItemForm.reset()
      } else if (item == 'changeprice') {
        this.priceDialog = false; this.$refs.priceForm.reset()
      } else if (item == 'remove') {
        this.removeDialog = false; this.$refs.removeForm.reset()
      } else {
        this.$refs.viewForm.reset();
        this.viewDialog = false

      }

    },

    getStatus(id) {
      if (id == 1) {
        return { 'color': 'green', 'name': 'received' }
      } else if (id == 0) {
        return { 'color': 'error', 'name': 'pending' }
      }
    },
    async initialize() {
      // await this.$api.get('/api/stocks/getStocksByProduct').then((res) => {
      const results = this.productStore.products
       console.log({'products':results}) ; console.log(this.stocksStore)
      const item = []; let i = 1
      results.forEach((el) => {
        let a = {
          'serial': i++,
          'name': el.name,
          'sku': el.sku,
          'inStockQty': this.stocksStore.getStockQty(el.id),
          'units': el.units,
          'costprice': el.costprice,
          'sellingprice': el.sellingprice,
          'alert_level': el.alert_level,
          'product': el.id,

        }
        item.push(a)
      })
      this.isHistory = false
      this.isTransfer = false
      this.isRemovals = false

      this.desserts = item

    }


  },

  setup() {
    const productStore = useProductStore()
    const stocksStore = useStockStore()
    const products = storeToRefs(productStore.products)
    const branchStore = storeToRefs(useBranchStore())
    const branches = branchStore.branches

    onMounted(() => {
      console.log(branches.value)
    })

    function getColor(item) {
      let color = ''
      if (item == 1) {
        color = 'primary'
      } else if (item == 2) {
        color = 'success'
      } else {
        color = 'error'
      }

      return color
    }


    return {
      products, getColor, branches
    }
  }
}
</script>