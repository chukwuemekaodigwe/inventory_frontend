<template>
    <ConfigLayout>
        
            <v-row>
                <v-col cols="12" sm="4">
                    <v-table density="compact" class="rounded border">
                        <thead class="bg-grey-lighten-4">
                            <tr>
                                <th>S/N</th>
                                <th> Title</th>

                                <th class="text-right"> <span class="text-caption">3/5 Used </span>
                                    
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="role, index in roles">
                                <td>{{ index + 1 }}</td>
                                <td>{{ role.title }}</td>

                                <td>

                                    <span class="d-flex flex-row justify-space-around">
                                        <v-icon icon="mdi-eye" color="black" size="small" @click="editRole(role)"></v-icon>
                                        <v-icon icon="mdi-pencil" color="info" size="small"
                                            @click="editRole(role)"></v-icon>
                                        <v-icon icon="mdi-delete" color="error" size="small"
                                            @click="deleteItem(role.id)"></v-icon>

                                    </span>

                                </td>

                            </tr>
                        </tbody>
                    </v-table>
                </v-col>

              
                <v-col cols="12" sm="8">
                    <v-card elevation="4" class="pa-5 pb-10">

                        <v-form ref="pageForm">
                            <v-row>
                                <v-col cols="12">
                                    
                                    <v-col cols="12">
                                        <v-text-field variant="outlined" density="compact" v-model="title" label="Role Name"
                                            required></v-text-field>

                                        </v-col>
                                    <v-row>
                                        <v-col cols="4" class="pt-7">
                                            <span> Select Priviledges : </span>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-checkbox v-model="all" @input="selectAll()" color="indigo">
                                                <template v-slot:label>
                                                    <div>
                                                        Select/Deselect
                                                    </div>
                                                </template>
                                            </v-checkbox>

                                        </v-col>
                                      
                                        <v-col cols="4" @click="{edit = false; deselectAll(); title = ''}" class="pt-6">
                                            <v-btn size="small" variant="outlined" class="align-right" color="primary"> Create New</v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                    <div v-for="c in permissions">
                                        <v-row>
                                            <v-col cols="3" v-for="p in c">
                                                <v-checkbox v-model="selected" color="indigo" :value="p.pseudo">
                                                    <template v-slot:label>
                                                        <div>
                                                            {{ p.title }}
                                                            <v-tooltip location="bottom">
                                                                <template v-slot:activator="{ props }">
                                                                    <v-icon icon="mdi-information-outline" color="primary"
                                                                        size="small" v-bind="props" @click.stop></v-icon>
                                                                </template>
                                                                {{ p.description }}
                                                            </v-tooltip>

                                                        </div>
                                                    </template>
                                                </v-checkbox>

                                            </v-col></v-row>
                                    </div>
                                    <div>
                                        <v-btn @click="(edit) ? saveEdit() : saveNew()" color="primary">Save</v-btn>
                                    </div>
                                </v-col>
                            </v-row>


                        </v-form>
                    </v-card>
                </v-col>
                <!-- </v-dialog> -->
            </v-row>
            <deleteAlert @submitted="getRoles()" />
        

    </ConfigLayout>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app';
import { usePermissionStore } from '../store/permissions';
import { useConfigStore } from '../store/config'

const { $api } = useNuxtApp()
const configStore = useConfigStore()
const permissionStore = usePermissionStore()

definePageMeta({
  middleware: [
    function (to, from) {
      const permission = [
      "can_add_user_roles","can_view_user_roles","can_edit_user_roles","can_delete_user_roles"
]
      if(to.path === '/roles' && !usePermissionStore().hasPermission(permission)){
        useConfigStore().alert_msg = 'You dont have access to this page'
        return abortNavigation()
      }
    },
    
  ],
});


const edit = ref(false)
const pageForm = ref()
const users = ref([])

const selected = ref([''])
const permissions = ref([])
const roles = ref([])
const title = ref('')
const all = ref(false)
const none = ref(false)
const perBackup = ref([])
const item = ref([])
function selectAll() {
    if (all.value) {
        let a = perBackup.value.map((el) => el.pseudo)
        selected.value = a

    } else {
        selected.value = []
    }
}

function deselectAll() {
    selected.value = ['']
}
function getPermissions() {
    $api.get('api/permissions/getPermissions').then((res) => {
        const r = res.data.result
        perBackup.value = r; //console.log(r)
        permissions.value = displayPermission(r)
        permissionStore.permissions = r
    })
        .catch((err) => {
            console.log(err.response)
            configStore.alert_msg = 'An error occurred'
        })
}


function displayPermission(items: Array<string>) {
    let result = []
    for (let index = 0; index < items.length; index += 4) {
        let a = items.slice(index, index + 4)
        result.push(a)
    }

    return result

}


function getRoles() {
    $api.get('/api/roles/getCompanyRoles').then((res) => {
        roles.value = res.data.result
        //console.log({ 'roles': res.data.result })

    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred'
            //console.log(err.response)
        })
}

function saveNew() {

    if (title.value) {
        $api.post('/api/roles/saveNew', { 'data': { 'title': title.value, 'selected': selected.value } })
            .then((res) => {
               // console.log(res.data)
                configStore.alert_msg = 'Saved Successfully'
                getRoles(); pageForm.value.reset(); deselectAll()
            })
            .catch((err) => {
                console.log(err.response)
                configStore.alert_msg = 'An error occurred'
            })
    }
}


function editRole(b) {
    if (b.company_id) {
        edit.value = true
    }
   // console.log(b)
    title.value = b.title
    selected.value = JSON.parse(b.permissions)
    item.value = b
}


function saveEdit() {
    const role = { 'title': title.value, 'selected': selected.value, 'id': item.value.id }
console.log(role)
    if (role.title && role.selected.length > 0) {
        $api.post('/api/roles/saveUpdate', {'data': role}).then((res) => {
            configStore.alert_msg = 'Successfully updated'
            getRoles(); pageForm.value.reset(); deselectAll()
            edit.value = false
        })
            .catch((err) => {
                configStore.alert_msg = `An error occurred: ${err.response.data.message}`
                console.log(err.response)
            })
    }
}


function deleteItem(c: number) {
    const url = `api/roles/delete/${c}`
    console.log(url)
    configStore.delete_alert = url

}

onMounted(() => {
    getRoles();
    if(!permissionStore.permissions?.length){
        getPermissions()
    }else{
        permissions.value = displayPermission(permissionStore.permissions)
    }
    
})


</script>