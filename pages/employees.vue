<template>
    <ConfigLayout>
            <v-row>
                <v-col cols="12" sm="8">
                    <v-table density="compact" class="rounded border">
                        <thead class="bg-grey-lighten-4">
                            <tr>
                                <th>S/N</th>
                                <th> Name</th>
                                <th>Phone </th>
                                <th>Branch </th>
                                <th> Role </th>
                                <th class="text-right text-caption">3/5 Used</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="branch, index in users">
                                <td>{{ index + 1 }}</td>
                                <td>{{ branch.name }}</td>
                                <td>{{ branch.phone }}</td>
                                <td>{{ getBranchName(branch.branch_id).title }}</td>
                                <td>{{ getRoleName(branch.role) }}</td>
                                <td>

                                    <span class="d-flex flex-row justify-space-around">
                                        <v-icon icon="mdi-eye" color="black" size="small" v-if="hasPermission(permission.view)"
                                            @click="editUser(branch)"></v-icon>
                                        <v-icon icon="mdi-pencil" color="info" size="small" v-if="hasPermission(permission.edit)"
                                            @click="editUser(branch)"></v-icon>
                                        <v-icon icon="mdi-delete" color="error" size="small" v-if="hasPermission(permission.delete)"
                                            @click="deleteItem(branch.id)"></v-icon>

                                    </span>

                                </td>

                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
              
<!-- <v-dialog v-if="mobile" v-model="edit"> -->
                <v-col cols="12" sm="4">
                    <v-card elevation="4" class="pa-5 pb-10">
                        <card-title class="text-caption my-2"> Employee</card-title>
                        <v-form ref="pageForm">

                            <v-row justify="center">
                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.name"
                                        label="Employee Name"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.phone" type="tel"
                                        label="Phone N&otilde;"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-autocomplete label="Destinated Branch" density="compact" item-title="title"
                                        item-value="id" variant="outlined" :items="branches"
                                        v-model="form.branch"></v-autocomplete>
                                </v-col>
                                <v-col cols="12">
                                    <v-autocomplete label="Role" density="compact" item-title="title" item-value="id"
                                        variant="outlined" :items="roles" v-model="form.role"></v-autocomplete>
                                </v-col>

                                <span class="text-caption">For Login</span> <v-divider></v-divider>
                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.email" type="email"
                                        label="Email" required></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.password"
                                        type="password" label="Password" required></v-text-field>
                                </v-col>

                                <v-btn v-if="hasPermission([...permission.add, ...permission.edit])" @click="(edit) ? saveEdit() : saveNew()" color="primary">Save</v-btn>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-col>
            <!-- </v-dialog> -->
            </v-row>
            <deleteAlert @submitted="mountUsers()" />
        

    </ConfigLayout>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app';
import { Branch, useBranchStore } from '../store/branchStore';
import { User, useUsersStore } from '../store/users'
import { useConfigStore } from '../store/config'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { usePermissionStore } from '~~/store/permissions';

const { $api } = useNuxtApp()
const branchStore = useBranchStore()
const usersStore = useUsersStore()
const configStore = useConfigStore()
const edit = ref(false)
const pageForm = ref()
const users = ref([])

const { mobile } = useDisplay()


definePageMeta({
  middleware: [
    function (to, from) {
      const permission = [
      "can_add_employees","can_view_employees","can_edit_employees","can_delete_employees",
]
      if(to.path === '/employees' && !usePermissionStore().hasPermission(permission)){
        useConfigStore().alert_msg = 'You dont have access to this page'
        return abortNavigation()
      }
    },
    
  ],
});

const permission = {
    'add': ["can_add_employees"],
    'view': ["can_view_employees"], 
    'edit' : ["can_edit_employees"],
    'delete': ["can_delete_employees"],
}

function hasPermission(per){
    return usePermissionStore().hasPermission(per)
}


const roles = ref([])

const form = ref({
    'name': '',
    'email': '',
    'phone': '',
    'branch': '',
    'role': ''
})


const branches = computed(() => branchStore.branches)

function mountUsers() {
    $api.get('api/employees/getEmployees').then((res) => {
        console.log(res.data.result); //throw Error()
        users.value = res.data.result
    })
        .catch((err) => {
            console.log(err.response)
        })
}


function getBranchName(n: number) {
    let res = branches.value.find((el) => el.id == n)
    return res
}

function getRoleName(n){
    let res = roles.value.find((el) => el.id == n)
    return res?.title
}


function saveNew() {
    const user = form.value
    console.log(user)
    if (user.name && user.role && user.branch) {

        $api.post('/api/employees/saveNew', user).then((res) => {

            const newUser = res.data.result
            usersStore.addNewUser(newUser)
            configStore.alert_msg = 'Employee Successfully Added'
            pageForm.value.reset()
            mountUsers()
            console.log(res)

        })
            .catch((err) => {
                console.log(err.response)
                configStore.alert_msg = `An error occurred: ${err.response.data.message}`
            })
    }

}


function editUser(b: User) {
    edit.value = true
    form.value = { ...b }
    console.log(form.value)
   form.value.branch = b.branch_id
}


function saveEdit() {
   const user = {...form.value}
   
   if(user.name && user.role && user.branch){
        $api.post('/api/employees/saveUpdate', user).then((res) => {
            const r = res.data.result
            usersStore.updateUser(r)
            configStore.alert_msg = 'Successfully updated'
            mountUsers(); pageForm.value.reset()
edit.value = false
        })
            .catch((err) => {
                configStore.alert_msg = `An error occurred: ${err.response.data.message}`
                console.log(err.response)
            })
    }
}


function deleteItem(c: number) {
    const url = `api/employees/delete/${c}`
    console.log(url)
    configStore.delete_alert = url

}


function getRoles() {
    $api.get('/api/roles/getCompanyRoles').then((res) => {
        roles.value = res.data.result
        console.log({ 'roles': res.data.result })

    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred'
            //console.log(err.response)
        })
}

onMounted(() => {
    mountUsers()
    getRoles()
})


</script>