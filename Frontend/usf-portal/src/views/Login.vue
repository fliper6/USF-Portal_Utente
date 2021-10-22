   
<template>
    <div id="login">
        <v-dialog max-width="400px" v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn
                color="grey"
                text
                x-large
                plain
                elevation="0"
                v-on="on"
                >Login</v-btn>
            </template>
            
            <v-tabs v-model="tab" show-arrows color="#800000" background-color="white" icons-and-text light grow>
                <v-tabs-slider class="col"></v-tabs-slider>
                <v-tab v-for="i in tabs" :key="i.name" >
                    <v-icon large class="tab">{{ i.icon }}</v-icon>
                    <div class="caption py-1" >{{ i.name }}</div>
                </v-tab>
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alert" class="alert">{{this.message}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="email" 
                                    :rules="[rules.required]"
                                    label="Email">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueLogin ? 'password' : 'text'" 
                                    v-model="password" 
                                    label="Password"
                                    :rules="[rules.required]"
                                    @click:append="() => (valueLogin = !valueLogin)">
                                    </v-text-field>
                                </v-col>
                            </v-container>
                        </v-card-text>

                        <v-card-actions class="justify-center">
                            <v-btn 
                            :loading="loading" 
                            v-ripple="{ class: 'primary--text' }" 
                            width="300" 
                            style="height:40px;" 
                            class="white--text" 
                            elevation="1" 
                            v-on:click="login()" 
                            color="#800000"
                            >Login</v-btn>
                        </v-card-actions>

            
                    </v-card>
                </v-tab-item>
                
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alert" class="alert">{{this.message_reg}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="email" 
                                    :rules="[rules.required,rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containdp]"
                                    label="Email" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="username" 
                                    :rules="[rules.required,rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containp,rules.containdp]"
                                    label="Full Name" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueRegistarPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarPass ? 'password' : 'text'"
                                    :rules="[rules.required]"  
                                    v-model="passRegist" label="Password"
                                    @click:append="() => (valueRegistarPass = !valueRegistarPass)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueRegistarConfirPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarConfirPass ? 'password' : 'text'"
                                    :rules="[rules.required, passwordMatch]" 
                                    block 
                                    v-model="passverify"
                                    label="Confirm Password"
                                    @click:append="() => (valueRegistarConfirPass = !valueRegistarConfirPass)">
                                    </v-text-field>
                                </v-col>
                            </v-container>
                        </v-card-text>

                        <v-card-actions class="justify-center">
                            <v-btn 
                            :loading="loading" 
                            v-ripple="{ class: 'primary--text' }" 
                            width="300" style="height:40px;" 
                            class="white--text" 
                            elevation="1" 
                            v-on:click="register()" 
                            color="#800000"
                            >Register</v-btn>
                        </v-card-actions>
          
                    </v-card>
                </v-tab-item>

            </v-tabs>   
        </v-dialog>
    </div>
</template>




<script>
//import axios from 'axios'
    export default {
        name: 'Login',
        data() {
            return {
                tab: 0,
                tabs: [
                    {name:"Login", icon:"mdi-account"},
                    {name:"Register", icon:"mdi-account-outline"}
                ],
                rules: {
                    required: value => !!value || "This camp is required.",
                    containv: v => !v.includes(',') || "Can't contain ','",
                    containpv: v => !v.includes(';') || "Can't contain ';'",
                    containa: v => !v.includes('"') || `Can't contain ' " '`,
                    containpe: v => !v.includes("'") || "Can't contain ' ' '",
                    containdp: v => !v.includes(':') || "Can't contain ':'",
                    containp: v => !v.includes('.') || "Can't contain '."
                },
                email: "",
                password: "",
                passRegist:"",
                passverify: "",
                username: "",
                type: "password",
                valueLogin: String,
                valueRegistarPass: String,
                valueRegistarConfirPass: String,
                message:'',
                message_reg : '',
                alert: false,
                loading: false,
                dialog: false,
            }
        },
        computed: {
            passwordMatch() {
                return () => this.passRegist === this.passverify || "Password must match";
            }
        },  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },   
        methods: {
            postLogin(json) {
               /* axios.post("http://localhost:13000/login", json)
                    .then(data => {
                        localStorage.setItem('jwt',data.data.token)
                        this.$router.go()
                        this.dialog = false
                        this.loading = false
                    })
                    .catch(() => {
                        this.alert = true
                        this.loading = false
                        this.message = "Email or password not valid!"
                    })*/
                    localStorage.setItem('jwt',json)
                    localStorage.setItem('jwt',this.email)
                    this.$router.go()
                    this.dialog = false
                    this.loading = false
            },
            login() {
                this.loading = true
                var json = {}
                json['email'] = this.email
                json['password'] = this.password
                this.postLogin(json)
            },
            
            register() {
                /*
                this.loading=true
                var json = {}
                json['email'] = this.email
                json['password'] = this.passRegist
                json['name'] = this.username
                json['dataRegisto'] = new Date().toISOString();
                
                axios.post("http://localhost:13000/login/register", json)
                    .then( () => {
                        json['password'] = this.password
                        this.postLogin(json)
                        this.loading = true
                    })
                    .catch(err => {
                        this.alert = true
                        this.loading = false
                        this.message_reg = err.response.data.message
                    })  */  
            },
                       
        }
    }
  
</script>



<style scoped>
    #login {
        margin: auto;
    }
    
    .alert {
        text-align: center;
        color: red;
    }
    
    .tab {
        color: #CCCCCC;
    }
    
    .col{
        color: #800000;
    }

</style>
