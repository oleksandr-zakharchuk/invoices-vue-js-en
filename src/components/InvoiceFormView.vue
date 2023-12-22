<script>
import axios from 'axios'
export default {
  name: "InvoiceFormView",
  data() {
    return {
      invoice_type: null,
      product_list: null,
      invoice: null,
      products: null,
      sub_success: false
    }
  },
  async created() {
    if (this.$route.params.invoice_created == 'invoice_created') {
      this.sub_success = true
    }

    this.product_list = await axios.get(axios.defaults.baseURL + '/create');
    
    
    let batch_id = this.$route.params.batch_id
    this.invoice = await axios.get(axios.defaults.baseURL + '/view', {
      params: {
        batch_id: batch_id
      }
    });
    this.products = this.invoice.data.json_list
    this.invoice_type = this.invoice.data.json_list[0].invoice_type;
  },
  computed: {
    console: () => console,
    window: () => window,
  }
}
</script>

<template>
<div class="container">
  <main>
    <div class="row g-5">
      <div class="col-md-7 col-lg-8 form">
        <h4 class="mb-3">Invoice</h4>
        <p v-if="sub_success">
            <ul class="list-group">
                <li class="list-group-item list-group-item-success">Invoice successfully created!</li>
            </ul>
        </p>
        <form class="needs-validation" novalidate="" @submit="checkForm" method="post">
          <div class="row g-3 form-field" v-for="(product, k) in products" :key="k">

            <div class="col-md-5">
              <label for="product" class="form-label" v-if="k == 0">Product</label>
              <select class="form-select" id="product" :required="true" v-model="product.product_id" disabled="true">
                <option 
                v-for="p in product_list.data.json_list" 
                v-bind:value="p.id"
                >{{ p.product_name }}</option>
              </select>
              <div class="invalid-feedback">
                Please select a product
              </div>
            </div>

            <div class="col-md-3">
              <label class="form-label" for="qty" v-if="k == 0">Quantity</label>
              <input min="1" max="100000" type="number" id="qty" class="form-control" :required="true" v-model.number="product.quantity" readonly/>
              <div class="invalid-feedback">
                Please enter quantity
              </div>
            </div>

          </div>

          <hr class="my-4">

          <h4 class="mb-3">Invoice type</h4>

          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="receipt_invoice" type="radio" value="receipt" class="form-check-input" required="" v-model="invoice_type" disabled>
              <label class="form-check-label" for="credit">Receipt invoice</label>
            </div>
            <div class="form-check">
              <input id="debit" name="transfer_invoice" type="radio" value="transfer" class="form-check-input" required="" v-model="invoice_type" disabled>
              <label class="form-check-label" for="debit">Transfer invoice</label>
            </div>
          </div>

          <hr class="my-4">

        </form>
        <router-link  to="/">
            <button class="w-100 btn  btn-lg">Back to list</button>
        </router-link>
      </div>
    </div>
  </main>
</div>
</template>

<style scoped>
  .form-field {
    margin-top: 0px;
  }
  .form {
    margin-top: 80px;
  }
</style>
