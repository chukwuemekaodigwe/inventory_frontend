<template>
    <ConfigLayout>

        <v-row>
            <v-col cols="12" sm="8">
                <v-card elevation="4" class="px-5 pb-10">
                    <v-table>
                        <thead class="bg-color-secondary-lighten-1">
                            <tr>
                                <th>Branch Name</th>
                                <!-- <th>Address </th>
                                <th>City </th> -->
                                <th>Admin/Manager</th>
                                <th class="text-right text-caption">3/5 Used</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="branch in branches">
                                <td>{{ branch.title }}</td>
                                <!-- <td>{{ branch.address }}</td>
                                <td>{{ branch.city }}</td> -->
                                <td>{{ getAdminName(branch.admin)?.name }}</td>
                                <td>
                                    <span class="d-flex flex-row justify-start">
                                        <v-icon size="small" v-if="hasPermission(permission.view)" icon="mdi-eye"
                                            @click="editBranch(branch)" variant="text" color="info"></v-icon>
                                        <v-icon size="small" v-if="hasPermission(permission.edit)" icon="mdi-pencil"
                                            @click="editBranch(branch)" variant="text" color="tertiary"></v-icon>

                                        <v-icon size="small" v-if="hasPermission(permission.delete)" icon="mdi-delete"
                                            @click="deleteItem(branch.id)" variant="icon" color="error"></v-icon>
                                    </span>

                                </td>

                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>

            <v-col cols="12" sm="4">
                
                    <v-card elevation="4" class="pa-5 pb-10">
                        <card-title class="text-caption my-2">New Branch Location</card-title>
                        <v-form ref="pageForm">

                            <v-row justify="center">
                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.title"
                                        label="Title for Identification"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.address"
                                        label="Branch Address" required
                                        placeholder="1 ICT Way, Victoria Island"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field variant="outlined" density="compact" v-model="form.city"
                                        placeholder="Lagos Lagos State" label="City/State" required></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-autocomplete label="Branch Admin/Manger" density="compact" item-title="name"
                                        item-value="id" variant="outlined" :items="users"
                                        v-model="form.admin"></v-autocomplete>
                                </v-col>
                                <v-btn @click="(edit) ? saveEdit() : saveBranch()" color="primary">Save</v-btn>
                            </v-row>
                        </v-form>
                    </v-card>
                
            </v-col>
        </v-row>
        <deleteAlert @submitted="mountBranches()" />


    </ConfigLayout>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app';
import { Branch, useBranchStore } from '../store/branchStore';
import { useUsersStore } from '../store/users'
import { useConfigStore } from '../store/config'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { usePermissionStore } from '~~/store/permissions';


const { $api } = useNuxtApp()
const branchStore = useBranchStore()
const usersStore = useUsersStore()
const configStore = useConfigStore()
const edit = ref(false)
const pageForm = ref()
const branches = ref([])

const { mobile } = useDisplay()

definePageMeta({
    middleware: [
        function (to, from) {
            const permission = [
                "can_add_branches", "can_view_branches", "can_edit_branches", "can_delete_branches",
            ]
            if (to.path === '/branch' && !usePermissionStore().hasPermission(permission)) {
                useConfigStore().alert_msg = 'You dont have access to this page'
                return abortNavigation()
            }
        },

    ],
});

const permission = {
    'add': [
        "can_add_branches",
    ],
    'edit': [
        "can_edit_branches",
    ],

    'delete': [
        "can_delete_branches",
    ],

    'view': [
        "can_view_branches",
    ]
}

function hasPermission(per) {
    return usePermissionStore().hasPermission(per)
}
const form = ref({
    'title': '',
    'address': '',
    'city': '',
    'admin': {
        'name': '',
        'id': 0
    }
})

const users = computed(() => usersStore.users)

function mountBranches() {
    $api.get('api/branches/getBranches').then((res) => {
        console.log(res.data.branches); //throw Error()
        const b = res.data.branches
        branches.value = b
    })
        .catch((err) => {
            console.log(err.response)
        })
}


function getAdminName(n: number) {
    let res = users.value.find((el) => el.id == n)
    return res
}

function viewBranch(b: Branch) {

    form.value = { ...b }
    form.value.admin = {
        'name': getAdminName(b.admin)?.name,
        'id': b.admin
    }
}

function editBranch(b: Branch) {
    edit.value = true
    form.value = { ...b }
    form.value.admin = {
        'name': getAdminName(b.admin)?.name,
        'id': b.admin
    }
}


function deleteItem(c: number) {
    const url = `api/branches/delete/${c}`
    console.log(url)
    configStore.delete_alert = url

}



function saveBranch() {
    const branch = form.value
    //throw Error('save add')
    if (branch.title && branch.address && branch.admin) {
        //branch.address = `${branch.address} ${branch.city}`
        $api.post('/api/branches/saveNew', { 'branch': branch }).then((res) => {

            const newBranch = res.data.result
            branchStore.addNewBranch(newBranch)
            configStore.alert_msg = 'Successfully created'
            pageForm.value.reset(); mountBranches();
            console.log(res)

        })
            .catch((err) => {
                console.log(err.response)
                configStore.alert_msg = 'An error occurred'
            })
    }

}


function saveEdit() {
    const branch = { ...form.value }
    branch.admin = form.value.admin.id
    //console.log(branch); throw Error()
    if (branch.title && branch.address) {
        $api.post('/api/branches/saveUpdate', { 'branch': branch }).then((res) => {
            //console.log(res.data)
            branchStore.updateBranch(branch)
            configStore.alert_msg = 'Successfully updated'
            mountBranches(); pageForm.value.reset()

        })
            .catch((err) => {
                configStore.alert_msg = 'An error occurred'
                console.log(err.response)
            })
    }
}


onMounted(() => {
    mountBranches()

    console.log(mobile.value)
})


</script>