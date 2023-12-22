import { createRouter, createWebHistory } from 'vue-router'
import InvoiceForm from './components/InvoiceForm.vue'
import Home from './components/Home.vue'
import InvoiceFormView from './components/InvoiceFormView.vue'
import axios from 'axios'

axios.defaults.baseURL = 'https://wholesale-trade-en-49924b3845db.herokuapp.com';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
        name: 'InvoiceForm',
        path: '/InvoiceForm',
        component: InvoiceForm,
    },
    {
        name: 'Home',
        path: '/',
        component: Home,
    },
    {
        name: 'InvoiceFormView',
        path: '/InvoiceFormView/:batch_id/:invoice_created?',
        component: InvoiceFormView,
        props: true
    }
  ]
})
